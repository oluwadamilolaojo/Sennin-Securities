import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react'
import * as M from '../data/mock.js'
import { uid, today, computeFees, amortise, sum, addMonths } from '../utils.js'

const VERSION = 3
const KEY = 'vendii-demo-v' + VERSION

function initial() {
  return {
    auth: { signedIn: false, admin: false },
    user: M.USER,
    holdings: M.HOLDINGS,
    bonds: M.BONDS,
    cash: M.CASH,
    orders: M.ORDERS,
    paidDividends: M.PAID_DIVIDENDS,
    claims: M.CLAIMS,
    mandates: M.MANDATES,
    loans: M.LOANS,
    notifications: M.NOTIFICATIONS,
    adminUsers: M.ADMIN_USERS,
    amlFlags: M.AML_FLAGS,
    complaints: M.COMPLAINTS,
    settings: M.SETTINGS,
    audit: M.AUDIT,
    waitlist: [],
    recurring: [],
    toasts: [],
    draftLoan: null,
    lastCheck: null,
  }
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...initial(), ...JSON.parse(raw), toasts: [] }
  } catch (e) { /* ignore */ }
  return initial()
}

const audit = (state, actor, action, detail) => [{ ts: today(), actor, action, detail }, ...state.audit].slice(0, 200)
const notify = (state, title, body) => [{ id: uid('n'), ts: today(), title, body, read: false }, ...state.notifications].slice(0, 50)

function reducer(state, a) {
  switch (a.type) {
    case 'RESET': return initial()
    case 'TOAST': return { ...state, toasts: [...state.toasts, { id: uid('t'), text: a.text, kind: a.kind || '' }] }
    case 'UNTOAST': return { ...state, toasts: state.toasts.filter(t => t.id !== a.id) }
    case 'SIGN_IN': return { ...state, auth: { signedIn: true, admin: !!a.admin } }
    case 'SIGN_OUT': return { ...state, auth: { signedIn: false, admin: false } }
    case 'READ_NOTIFS': return { ...state, notifications: state.notifications.map(n => ({ ...n, read: true })) }
    case 'SET_CHECK': return { ...state, lastCheck: a.check }
    case 'WAITLIST': return { ...state, waitlist: [...state.waitlist, a.entry] }

    case 'PLACE_ORDER': {
      const o = a.order
      return {
        ...state, orders: [o, ...state.orders],
        notifications: notify(state, 'Order received', `${o.side} ${o.units.toLocaleString()} ${o.ticker}. We will tell you at every step.`),
        audit: audit(state, 'Customer', 'Order placed', `${o.id} ${o.ticker} ${o.side} ${o.units}`),
      }
    }
    case 'CANCEL_ORDER': {
      return {
        ...state,
        orders: state.orders.map(o => o.id === a.id ? { ...o, status: o.filled > 0 ? 'Cancelled (part filled)' : 'Cancelled', timeline: [...o.timeline, ['Cancelled', today()]] } : o),
        audit: audit(state, 'Customer', 'Order cancelled', a.id),
      }
    }
    case 'ADVANCE_ORDER': {
      // admin desk moves an order along: Received -> Sent to broker -> On exchange -> Filled -> Settled
      const steps = ['Received', 'Sent to broker', 'On exchange', 'Filled', 'Settled']
      let holdings = state.holdings, cash = state.cash
      const orders = state.orders.map(o => {
        if (o.id !== a.id) return o
        const idx = Math.max(0, steps.indexOf(o.status === 'Partly filled' || o.status === 'Queued for open' ? 'On exchange' : o.status))
        const next = steps[Math.min(steps.length - 1, idx + 1)]
        const upd = { ...o, status: next, timeline: [...o.timeline, [next, today()]] }
        if (next === 'Filled') upd.filled = o.units
        if (next === 'Settled' && o.owner === 'u-1') {
          const px = o.limit || (M.STOCKS.find(s => s.ticker === o.ticker)?.price || 0)
          const gross = o.units * px
          const fees = computeFees(gross, state.settings).total
          if (o.side === 'Buy') {
            const h = holdings.find(h => h.ticker === o.ticker)
            holdings = h
              ? holdings.map(h => h.ticker === o.ticker ? { ...h, avgCost: (h.avgCost * h.units + gross) / (h.units + o.units), units: h.units + o.units } : h)
              : [...holdings, { ticker: o.ticker, units: o.units, avgCost: px }]
            cash = { ...cash, settled: Math.max(0, cash.settled - gross - fees) }
            upd.total = gross + fees
          } else {
            holdings = holdings.map(h => h.ticker === o.ticker ? { ...h, units: Math.max(0, h.units - o.units) } : h).filter(h => h.units > 0)
            cash = { ...cash, settled: cash.settled + gross - fees }
            upd.total = gross - fees
          }
        }
        return upd
      })
      const o = orders.find(x => x.id === a.id)
      return {
        ...state, orders, holdings, cash,
        notifications: o.owner === 'u-1' ? notify(state, `Order ${o.status.toLowerCase()}`, `${o.side} ${o.units.toLocaleString()} ${o.ticker} is now ${o.status.toLowerCase()}.`) : state.notifications,
        audit: audit(state, 'Order desk', 'Order moved to ' + o.status, a.id),
      }
    }
    case 'DEPOSIT': return { ...state, cash: { ...state.cash, settled: state.cash.settled + a.amount }, notifications: notify(state, 'Money received', `₦${a.amount.toLocaleString()} landed in your Vendii account.`), audit: audit(state, 'System', 'Deposit', `₦${a.amount.toLocaleString()} by transfer`) }
    case 'WITHDRAW': return { ...state, cash: { ...state.cash, settled: state.cash.settled - a.amount }, notifications: notify(state, 'Withdrawal sent', `₦${a.amount.toLocaleString()} is on its way to ${state.user.bank.name} ••${state.user.bank.last4}.`), audit: audit(state, 'Customer', 'Withdrawal', `₦${a.amount.toLocaleString()} to ${state.user.bank.name}`) }
    case 'TOGGLE_SWEEP': return { ...state, cash: { ...state.cash, sweep: !state.cash.sweep } }
    case 'ADD_RECURRING': return { ...state, recurring: [...state.recurring, a.plan] }
    case 'REMOVE_RECURRING': return { ...state, recurring: state.recurring.filter(p => p.id !== a.id) }
    case 'SUBSCRIBE_BOND': {
      const b = a.bond
      return { ...state, bonds: [...state.bonds, b], cash: { ...state.cash, settled: state.cash.settled - b.amount }, notifications: notify(state, 'Savings bond subscribed', `₦${b.amount.toLocaleString()} in the ${b.tenor}-year FGN Savings Bond. Settles ${M.BOND_WINDOW.settles}.`), audit: audit(state, 'Customer', 'Bond subscription', `${b.units} units, ${b.tenor} year`) }
    }
    case 'UPDATE_USER': return { ...state, user: { ...state.user, ...a.patch }, audit: audit(state, 'Customer', 'Profile updated', Object.keys(a.patch).join(', ')) }
    case 'SET_SECURITY': return { ...state, user: { ...state.user, security: { ...state.user.security, ...a.patch } } }

    case 'START_CLAIMS': {
      const claims = a.claims.map(c => ({ ...c, id: uid('CLM'), owner: 'u-1', status: 'Submitted', step: 2, updated: today(), note: 'POA signed. Sent to registrar.' }))
      return { ...state, claims: [...claims, ...state.claims], notifications: notify(state, 'Recovery started', `${claims.length} claims submitted. We chase each registrar for you.`), audit: audit(state, 'Customer', 'Recovery claims started', claims.map(c => c.company).join(', ')) }
    }
    case 'UPLOAD_CLAIM_DOC': return { ...state, claims: state.claims.map(c => c.id === a.id ? { ...c, status: 'With registrar', step: 3, note: 'Certificate uploaded, registrar reviewing', updated: today() } : c), audit: audit(state, 'Customer', 'Claim document uploaded', a.id) }
    case 'ADVANCE_CLAIM': {
      const flow = ['Awaiting probate', 'Identity check', 'With registrar', 'Approved', 'Paid']
      let cash = state.cash
      const claims = state.claims.map(c => {
        if (c.id !== a.id) return c
        const cur = flow.indexOf(c.status)
        const idx = cur < 0 ? (c.status === 'Submitted' || c.status === 'Action needed' ? 1 : 0) : cur
        const next = flow[Math.min(flow.length - 1, idx + 1)]
        return { ...c, status: next, step: Math.min(5, idx + 2), updated: today(), note: next === 'Paid' ? 'Paid to bank, fee collected by direct debit' : next }
      })
      const c = claims.find(x => x.id === a.id)
      return { ...state, claims, cash, notifications: c.owner === 'u-1' ? notify(state, `Claim ${c.status.toLowerCase()}`, `${c.company}: ${c.status}.`) : state.notifications, audit: audit(state, 'Claims team', 'Claim moved to ' + c.status, a.id) }
    }
    case 'SUBMIT_MANDATE': return { ...state, mandates: state.mandates.map(m => m.registrar === a.registrar ? { ...m, status: 'Submitted' } : m), audit: audit(state, 'Customer', 'E-dividend mandate submitted', a.registrar) }

    case 'SET_DRAFT_LOAN': return { ...state, draftLoan: a.draft }
    case 'CREATE_LOAN': {
      const l = a.loan
      return { ...state, loans: [l, ...state.loans], draftLoan: null, notifications: notify(state, 'Loan application received', `₦${l.amount.toLocaleString()} for ${l.tenor} months. Trust Bank usually decides within one working day.`), audit: audit(state, 'Customer', 'Loan application', `${l.id} ₦${l.amount.toLocaleString()}`) }
    }
    case 'APPROVE_LOAN': {
      const loans = state.loans.map(l => l.id === a.id ? { ...l, status: 'Active', start: today(), alerts: [[today(), 'Lien placed at CSCS on ' + l.collateral.length + ' securities', 'email'], [today(), `Loan paid out ₦${l.amount.toLocaleString()} to bank`, 'SMS, WhatsApp, email'], ...(l.alerts || [])] } : l)
      const l = loans.find(x => x.id === a.id)
      return { ...state, loans, notifications: l.owner === 'u-1' ? notify(state, 'Loan approved and paid', `₦${l.amount.toLocaleString()} is on its way to ${state.user.bank.name} ••${state.user.bank.last4}.`) : state.notifications, audit: audit(state, 'Credit (Trust Bank)', 'Loan approved', a.id) }
    }
    case 'DECLINE_LOAN': return { ...state, loans: state.loans.map(l => l.id === a.id ? { ...l, status: 'Declined' } : l), audit: audit(state, 'Credit (Trust Bank)', 'Loan declined', a.id) }
    case 'REPAY': {
      const loans = state.loans.map(l => {
        if (l.id !== a.id) return l
        const out = Math.max(0, l.outstanding - a.amount)
        return { ...l, outstanding: out, status: out === 0 ? 'Repaid' : l.status, payments: [...l.payments, { n: l.payments.length + 1, date: today(), amount: a.amount, status: 'Paid' }], alerts: [[today(), `Repayment of ₦${a.amount.toLocaleString()} received`, 'SMS, email, app'], ...(l.alerts || [])] }
      })
      const l = loans.find(x => x.id === a.id)
      return { ...state, loans, cash: a.fromCash ? { ...state.cash, settled: state.cash.settled - a.amount } : state.cash, notifications: notify(state, l.status === 'Repaid' ? 'Loan repaid, lien lifting' : 'Repayment received', `₦${a.amount.toLocaleString()} applied to ${l.id}.${l.status === 'Repaid' ? ' Your shares are free within 1 working day.' : ''}`), audit: audit(state, 'Customer', 'Loan repayment', `${a.id} ₦${a.amount.toLocaleString()}`) }
    }
    case 'PLEDGE_MORE': {
      const loans = state.loans.map(l => l.id === a.id ? { ...l, collateral: [...l.collateral, a.item], alerts: [[today(), `Pledged ${a.item.units.toLocaleString()} ${a.item.ticker}`, 'email, app'], ...(l.alerts || [])] } : l)
      return { ...state, loans, audit: audit(state, 'Customer', 'Collateral added', `${a.id} ${a.item.ticker} ${a.item.units}`) }
    }
    case 'LIQUIDATE': {
      const loans = state.loans.map(l => l.id === a.id ? { ...l, outstanding: Math.max(0, l.outstanding - a.proceeds), collateral: l.collateral.map(c => c.ticker === a.ticker ? { ...c, units: c.units - a.units } : c).filter(c => c.units > 0), alerts: [[today(), `Sold ${a.units.toLocaleString()} ${a.ticker} to restore loan health. Record sent.`, 'SMS, WhatsApp, email, app'], ...(l.alerts || [])] } : l)
      return { ...state, loans, audit: audit(state, 'Credit (Trust Bank)', 'Collateral sold', `${a.id} ${a.ticker} ${a.units} for ₦${a.proceeds.toLocaleString()}`) }
    }

    case 'KYC': return { ...state, adminUsers: state.adminUsers.map(u => u.id === a.id ? { ...u, kyc: a.status, chn: a.status === 'Verified' && !u.chn ? 'pending' : u.chn } : u), audit: audit(state, 'Onboarding (admin)', 'KYC ' + a.status, a.id) }
    case 'RESOLVE_FLAG': return { ...state, amlFlags: state.amlFlags.map(f => f.id === a.id ? { ...f, status: a.status } : f), audit: audit(state, 'Compliance', 'Flag ' + a.status, a.id) }
    case 'COMPLAINT': return { ...state, complaints: [a.complaint, ...state.complaints], audit: audit(state, 'Customer', 'Complaint logged', a.complaint.id) }
    case 'COMPLAINT_STATUS': return { ...state, complaints: state.complaints.map(c => c.id === a.id ? { ...c, status: a.status } : c), audit: audit(state, 'Support', 'Complaint ' + a.status, a.id) }
    case 'SETTINGS': return { ...state, settings: { ...state.settings, ...a.patch }, audit: audit(state, 'Admin', 'Settings changed', Object.keys(a.patch).join(', ')) }
    case 'FLAG': return { ...state, settings: { ...state.settings, flags: { ...state.settings.flags, [a.key]: a.value } }, audit: audit(state, 'Admin', 'Feature flag ' + a.key, String(a.value)) }
    case 'ADVANCE_RATE': return { ...state, settings: { ...state.settings, advance: { ...state.settings.advance, [a.ticker]: a.rate } }, audit: audit(state, 'Credit (Trust Bank)', 'Advance rate changed', `${a.ticker} ${Math.round(a.rate * 100)}%`) }
    default: return state
  }
}

const Ctx = createContext(null)

export function StoreProvider({ children, override }) {
  const [state, dispatch] = useReducer(reducer, override, o => o ? { ...initial(), ...o } : load())
  useEffect(() => {
    const { toasts, ...rest } = state
    try { localStorage.setItem(KEY, JSON.stringify(rest)) } catch (e) { /* ignore */ }
  }, [state])

  const toast = useCallback((text, kind) => {
    dispatch({ type: 'TOAST', text, kind })
  }, [])
  useEffect(() => {
    if (!state.toasts.length) return
    const t = setTimeout(() => dispatch({ type: 'UNTOAST', id: state.toasts[0].id }), 3200)
    return () => clearTimeout(t)
  }, [state.toasts])

  const value = useMemo(() => ({ state, dispatch, toast }), [state, toast])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useStore = () => useContext(Ctx)

// ---------- selectors ----------
export function stockOf(ticker) { return M.STOCKS.find(s => s.ticker === ticker) }
export function priceOf(ticker, settings) {
  const s = stockOf(ticker)
  if (!s) return 0
  return s.price * (1 - (settings?.marketShock || 0))
}
export function portfolio(state) {
  const rows = state.holdings.map(h => {
    const s = stockOf(h.ticker)
    const px = priceOf(h.ticker, state.settings)
    const value = h.units * px
    const cost = h.units * h.avgCost
    const divs = sum(state.paidDividends.filter(d => d.ticker === h.ticker), d => d.net)
    return { ...h, stock: s, price: px, value, cost, gain: value - cost, divs, totalReturn: (value - cost + divs) / (cost || 1) }
  })
  const bondsValue = sum(state.bonds, b => b.amount)
  const equity = sum(rows, r => r.value)
  const dayChange = sum(rows, r => r.units * (r.price - r.stock.prev * (1 - (state.settings.marketShock || 0))))
  const openBuys = state.orders.filter(o => o.owner === 'u-1' && o.side === 'Buy' && ['Received', 'Sent to broker', 'On exchange', 'Partly filled', 'Queued for open'].includes(o.status))
  const reserved = sum(openBuys, o => (o.units - o.filled) * (o.limit || stockOf(o.ticker).price))
  const cost = sum(rows, r => r.cost) + bondsValue
  const divsAll = sum(state.paidDividends, d => d.net)
  return { rows, equity, bondsValue, total: equity + bondsValue + state.cash.settled + state.cash.unsettled, dayChange, reserved, cost, divsAll, totalReturn: (equity + bondsValue - cost + divsAll) / (cost || 1) }
}
export function upcomingDividends(state) {
  return state.holdings.map(h => {
    const s = stockOf(h.ticker)
    if (!s?.nextDiv) return null
    const gross = h.units * s.nextDiv.amount
    return { ticker: h.ticker, ...s.nextDiv, units: h.units, gross, wht: gross * 0.1, net: gross * 0.9 }
  }).filter(Boolean).sort((a, b) => a.pay.localeCompare(b.pay))
}
export function activeLoan(state) {
  return state.loans.find(l => l.owner === 'u-1' && ['Active', 'Pending approval'].includes(l.status)) || null
}
export function loanMetrics(loan, state) {
  const s = state.settings
  const rows = loan.collateral.map(c => {
    const st = stockOf(c.ticker)
    const px = priceOf(c.ticker, s)
    return { ...c, name: st?.name, price: px, value: c.units * px, base: c.units * st.price, advance: s.advance[c.ticker] ?? st.advance, liquidity: st.liquidity }
  })
  const collateral = sum(rows, r => r.value)
  const ltv = collateral > 0 ? loan.outstanding / collateral : 0
  const band = ltv >= s.liqLtv ? 'liquidation' : ltv >= s.callLtv ? 'call' : ltv >= s.warnLtv ? 'warning' : 'healthy'
  const cureNeeded = Math.max(0, loan.outstanding - collateral * s.warnLtv)
  const fallToCall = collateral > 0 ? Math.max(0, 1 - loan.outstanding / (s.callLtv * collateral)) : 0
  const schedule = amortise(loan.amount, loan.rate, loan.tenor).map((r, i) => ({ ...r, date: addMonths(loan.start || today(), i + 1), status: i < loan.payments.filter(p => p.status === 'Paid').length ? 'Paid' : 'Scheduled' }))
  return { rows, collateral, ltv, band, cureNeeded, fallToCall, schedule }
}
export function eligibleCollateral(state) {
  const s = state.settings
  return state.holdings.map(h => {
    const st = stockOf(h.ticker)
    const px = priceOf(h.ticker, s)
    const avg30 = Math.min(px, (st.history.slice(-6).reduce((a, b) => a + b, 0) / 6) * (1 - (s.marketShock || 0)))
    const adv = s.advance[h.ticker] ?? st.advance
    const value = h.units * avg30
    return { ...h, stock: st, valuation: avg30, value, advance: adv, borrowable: value * adv, liquidity: st.liquidity, bank: !!st.bank }
  })
}

export { reducer, initial }
