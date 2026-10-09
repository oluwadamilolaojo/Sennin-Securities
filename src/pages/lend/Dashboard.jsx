import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { TopBar } from '../../layouts/Shell.jsx'
import { useStore, activeLoan, loanMetrics, priceOf, stockOf } from '../../store/store.jsx'
import { Pill, HealthBar, Modal, Empty, statusPill } from '../../components/ui.jsx'
import { naira, n0, n2, pct, fmtDate, fmtTime, today } from '../../utils.js'

export default function LendDashboard() {
  const { state, dispatch, toast } = useStore()
  const loan = activeLoan(state) || state.loans.find(l => l.owner === 'u-1')
  const [repay, setRepay] = useState(200000)
  const [modal, setModal] = useState(null)
  const s = state.settings
  if (!loan) return <><TopBar title="My loan" plain /><div className="content"><div className="card"><Empty title="No loan yet" body="See what you can borrow against your shares in about a minute." action={<Link className="btn btn-g" to="/lend/start">Check what I can borrow</Link>} /></div></div></>
  if (loan.status === 'Pending approval') return (
    <>
      <TopBar title={`My loan · ${loan.id}`} plain />
      <div className="content">
        <div className="card" style={{ maxWidth: 720 }}>
          <Pill kind="warn">Pending approval</Pill>
          <h2 style={{ fontSize: 22, marginTop: 10 }}>Trust Bank is reviewing your application</h2>
          <p className="muted" style={{ marginTop: 8 }}>{naira(loan.amount)} for {loan.tenor} months. The credit team usually decides within one working day. Your shares are not yet under lien, and you can withdraw the application any time before approval.</p>
          <div className="stack" style={{ gap: 8, marginTop: 16 }}>{loan.alerts.map((a, i) => <div className="rowline" key={i}><span>{a[1]}<div className="muted xs">{a[2]}</div></span><span className="muted xs">{fmtTime(a[0])}</span></div>)}</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}><button className="btn btn-o" type="button" onClick={() => { dispatch({ type: 'DECLINE_LOAN', id: loan.id }); toast('Application withdrawn') }}>Withdraw application</button><button className="btn btn-p" type="button" onClick={() => { dispatch({ type: 'APPROVE_LOAN', id: loan.id }); toast('Approved and paid out', 'good') }}>Demo: simulate bank approval</button></div>
          <div className="muted xs" style={{ marginTop: 10 }}>In production the approval happens in the lender console under Admin → Loan book.</div>
        </div>
      </div>
    </>
  )
  if (loan.status === 'Repaid' || loan.status === 'Declined') return <><TopBar title={`My loan · ${loan.id}`} plain /><div className="content"><div className="card"><Empty title={loan.status === 'Repaid' ? 'Loan repaid. Lien lifted.' : 'Application declined'} body={loan.status === 'Repaid' ? 'Your shares are free to sell or pledge again.' : 'You can apply again with different collateral.'} action={<Link className="btn btn-g" to="/lend/start">Borrow again</Link>} /></div></div></>

  const m = loanMetrics(loan, state)
  const danger = m.band === 'call' || m.band === 'liquidation'
  const warning = m.band === 'warning'
  const unpledged = state.holdings.filter(h => !loan.collateral.find(c => c.ticker === h.ticker) && (s.advance[h.ticker] ?? stockOf(h.ticker).advance) > 0)
  const payoff = loan.outstanding + loan.outstanding * loan.rate / 12 * 0.5
  const liqPick = m.rows.filter(r => r.liquidity === 'High').sort((a, b) => b.value - a.value)[0] || m.rows[0]
  const liqUnits = liqPick ? Math.min(liqPick.units, Math.ceil(m.cureNeeded * 1.6 / liqPick.price)) : 0
  const liqProceeds = liqPick ? liqUnits * liqPick.price * 0.98 : 0
  const cureFromCash = Math.min(state.cash.settled, Math.ceil(m.cureNeeded / 10000) * 10000 + 10000)
  const after = (newOut, newColl) => newColl > 0 ? newOut / newColl : 0
  function doRepay(amount, fromCash) {
    if (amount <= 0) return
    if (fromCash && amount > state.cash.settled) { toast('Not enough settled cash', 'bad'); return }
    dispatch({ type: 'REPAY', id: loan.id, amount: Math.min(amount, Math.ceil(payoff)), fromCash })
    toast('Repayment applied', 'good'); setModal(null)
  }
  return (
    <>
      {danger ? (
        <div style={{ background: 'var(--bad)', color: '#fff', padding: '18px 32px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20 }}>
          <div style={{ flex: '1 1 400px' }}><div className="small" style={{ fontWeight: 600, opacity: .9 }}>Action needed on loan {loan.id}</div><h1 style={{ fontSize: 22, marginTop: 4 }}>Your shares have fallen. Add cash or shares within {s.cureDays} working days.</h1></div>
          <div style={{ textAlign: 'right' }}><div className="small" style={{ opacity: .9 }}>Time left</div><div style={{ fontSize: 34, fontWeight: 700, lineHeight: 1 }}>2 days 4 hrs</div><div className="small" style={{ opacity: .9 }}>then enough shares are sold to restore the loan</div></div>
        </div>
      ) : <TopBar title={`My loan · ${loan.id}`} plain><span className="muted small">Collateral revalued today 14:35 WAT</span><button className="btn btn-o btn-s" type="button" onClick={() => toast('Statement downloading')}>Download statement</button></TopBar>}
      <div className="content">
        <div className="grid g3" style={{ alignItems: 'stretch' }}>
          <div className={'card span2'} style={danger ? { borderColor: 'var(--bad)' } : warning ? { borderColor: 'var(--gold)' } : {}}>
            <div className="row" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div><div className="muted small">Loan health</div><div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 4 }}><span style={{ fontSize: 40, fontWeight: 700, color: danger ? 'var(--bad)' : warning ? 'var(--warn)' : 'var(--good)' }}>{danger ? pct(m.ltv * 100) : warning ? 'Warning' : 'Healthy'}</span><span>loan {danger ? 'of' : 'is'} <strong>{pct(m.ltv * 100)}</strong> {danger ? '' : 'of'} your shares' value{danger ? '' : ''}</span></div></div>
              <div style={{ textAlign: 'right', fontSize: 14 }}>{danger ? <>To get back to a healthy {pct(s.warnLtv * 100)} you need about <strong style={{ fontSize: 18 }}>{naira(m.cureNeeded)}</strong> more cover.</> : <><div className="muted xs">Your shares could fall</div><div style={{ fontSize: 24, fontWeight: 700, color: 'var(--good)' }}>{pct(m.fallToCall * 100, 0)}</div><div className="muted xs">before we'd ask you to act</div></>}</div>
            </div>
            <div style={{ marginTop: 18 }}><HealthBar ltv={m.ltv} settings={s} /></div>
            <div className="grid g4" style={{ marginTop: 20, gap: 14, fontSize: 14 }}>
              <div><div className="muted xs">You still owe</div><div style={{ fontSize: 20, fontWeight: 700 }} className="num">{naira(loan.outstanding)}</div></div>
              <div><div className="muted xs">Pledged shares worth</div><div style={{ fontSize: 20, fontWeight: 700 }} className="num">{naira(m.collateral)}</div><div className={'xs ' + (s.marketShock > 0 ? 'dn' : 'muted')}>{s.marketShock > 0 ? `-${Math.round(s.marketShock * 100)}% since pledge` : 'revalued daily'}</div></div>
              <div><div className="muted xs">Next payment</div><div style={{ fontSize: 20, fontWeight: 700 }} className="num">{naira(m.schedule.find(r => r.status === 'Scheduled')?.payment || 0)}</div><div className="muted xs">{fmtDate(m.schedule.find(r => r.status === 'Scheduled')?.date)} · direct debit {state.user.bank.name} ••{state.user.bank.last4}</div></div>
              <div><div className="muted xs">Payments made</div><div style={{ fontSize: 20, fontWeight: 700 }}>{loan.payments.length} of {loan.tenor}</div><div className="muted xs">on time</div></div>
            </div>
          </div>
          <div className="card">
            <h2 style={{ fontSize: 17 }}>Repay any time</h2>
            <div className="muted small" style={{ marginTop: 4 }}>No early repayment charge. Pay off today for <strong style={{ color: 'var(--ink)' }}>{naira(payoff)}</strong> including interest to date.</div>
            <input className="inp" type="number" step="10000" value={repay} onChange={e => setRepay(Number(e.target.value))} style={{ marginTop: 14 }} aria-label="Amount to repay" />
            <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}><button className="btn btn-o btn-s" type="button" onClick={() => setRepay(100000)}>₦100,000</button><button className="btn btn-o btn-s" type="button" onClick={() => setRepay(Math.round(m.schedule.find(r => r.status === 'Scheduled')?.payment || 0))}>Next instalment</button><button className="btn btn-o btn-s" type="button" onClick={() => setRepay(Math.ceil(payoff))}>Pay off everything</button></div>
            <button className="btn btn-p btn-block" type="button" style={{ marginTop: 12 }} onClick={() => setModal('repay')}>Repay {naira(repay)}</button>
            <div className="muted xs" style={{ marginTop: 10 }}>Paying extra lowers your health bar and your interest. When the balance hits zero the CSCS lien lifts within 1 working day, automatically.</div>
          </div>
        </div>

        {(danger || warning) && (
          <div>
            <h2 style={{ fontSize: 17, marginBottom: 12 }}>{danger ? 'Pick one. Each takes under a minute.' : 'You are in the warning zone. Act now and it never becomes a call.'}</h2>
            <div className="grid g3">
              <div className="card" style={{ borderColor: 'var(--ink)', boxShadow: 'inset 0 0 0 1px var(--ink)', display: 'flex', flexDirection: 'column', gap: 10 }}><div style={{ fontWeight: 600, fontSize: 16 }}>Repay part from your Vendii cash</div><div className="muted small">You have {naira(state.cash.settled)} settled cash in Vendii Trading. Use {naira(cureFromCash)} of it. Nothing to transfer.</div><div className="row" style={{ marginTop: 'auto' }}><span className="muted small">Health after</span><span className="up" style={{ fontWeight: 700 }}>{pct(after(loan.outstanding - cureFromCash, m.collateral) * 100)}</span></div><button className="btn btn-p" type="button" disabled={cureFromCash <= 0} onClick={() => doRepay(cureFromCash, true)}>Repay {naira(cureFromCash)} now</button></div>
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}><div style={{ fontWeight: 600, fontSize: 16 }}>Transfer cash in</div><div className="muted small">Send {naira(m.cureNeeded)} or more to your Vendii account {state.user.virtualAccount.number} from any bank. Counts the moment it lands.</div><div className="row" style={{ marginTop: 'auto' }}><span className="muted small">Health after</span><span className="up" style={{ fontWeight: 700 }}>{pct(s.warnLtv * 100)}</span></div><Link className="btn btn-o" to="/app/funding">Go to funding</Link></div>
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}><div style={{ fontWeight: 600, fontSize: 16 }}>Pledge more shares</div><div className="muted small">{unpledged.length ? `You hold ${unpledged.map(h => `${n0(h.units)} ${h.ticker} (${naira(h.units * priceOf(h.ticker, s))})`).join(' and ')} that aren't pledged. One CSCS code adds them.` : 'All your eligible shares are already pledged.'}</div>{unpledged[0] && <div className="row" style={{ marginTop: 'auto' }}><span className="muted small">Health after ({unpledged[0].ticker})</span><span className="up" style={{ fontWeight: 700 }}>{pct(after(loan.outstanding, m.collateral + unpledged[0].units * priceOf(unpledged[0].ticker, s)) * 100)}</span></div>}<button className="btn btn-o" type="button" disabled={!unpledged.length} onClick={() => setModal('pledge')}>Pledge {unpledged[0]?.ticker || 'shares'}</button></div>
            </div>
          </div>
        )}

        <div className="grid g3" style={{ alignItems: 'start' }}>
          <div className="card tight span2">
            <div className="card-head"><h2>Pledged shares</h2><span className="muted small">Which shares sell first if it comes to that <Pill>Phase 2</Pill></span></div>
            <div className="scroll"><table className="tbl"><thead><tr><th>Security</th><th className="num">Units pledged</th><th className="num">Price today</th><th className="num">Value</th><th className="num">Since pledge</th><th>Dividends</th><th>Status</th></tr></thead><tbody>
              {m.rows.map(r => { const st = stockOf(r.ticker); const chg = r.value / r.base - 1; return <tr key={r.ticker}><td><strong>{r.ticker}</strong></td><td className="num">{n0(r.units)}</td><td className="num">₦{n2(r.price)}</td><td className="num">{naira(r.value)}</td><td className={'num ' + (chg < 0 ? 'dn' : 'up')}>{chg >= 0 ? '+' : ''}{pct(chg * 100)}</td><td className="small">{st.nextDiv ? <span className="up" style={{ fontWeight: 600 }}>{naira(r.units * st.nextDiv.amount * 0.9)} paid to you {fmtDate(st.nextDiv.pay)}</span> : <span className="muted">None declared</span>}</td><td><Pill kind="info">Lien, Trust Bank</Pill></td></tr> })}
            </tbody></table></div>
            <div className="card-foot"><span>Dividends on pledged shares keep coming to your bank.</span><span style={{ marginLeft: 'auto' }} className="muted">Use dividends to pay down the loan automatically <Pill>Phase 2</Pill></span></div>
          </div>
          <div className="stack">
            <div className="card"><h2 style={{ fontSize: 17 }}>Messages we've sent you</h2><div className="stack" style={{ gap: 8, marginTop: 12 }}>{loan.alerts.slice(0, 6).map((a, i) => <div className="rowline" key={i} style={{ fontSize: 13 }}><span><strong>{a[1]}</strong><div className="muted">{a[2]}</div></span><span className="muted xs" style={{ whiteSpace: 'nowrap' }}>{fmtTime(a[0])}</span></div>)}</div><Link to="/lend/documents" className="small" style={{ display: 'inline-block', marginTop: 10 }}>Full audit trail</Link></div>
            {danger && liqPick && <div className="card"><h2 style={{ fontSize: 15 }}>If you do nothing by the deadline</h2><p className="muted xs" style={{ marginTop: 4 }}>This is exactly what would happen. No surprises.</p><div className="kv" style={{ marginTop: 8 }}><span>1st: sell {n0(liqUnits)} {liqPick.ticker} at about ₦{n2(liqPick.price)}</span><strong className="num">{naira(liqUnits * liqPick.price)}</strong></div><div className="kv"><span className="muted">Selling charges</span><span className="num">-{naira(liqUnits * liqPick.price * 0.02)}</span></div><div className="kv tot"><span>Applied to the loan</span><span className="num">{naira(liqProceeds)}</span></div><div className="muted xs" style={{ marginTop: 6 }}>Loan after: {naira(loan.outstanding - liqProceeds)}, health {pct(after(loan.outstanding - liqProceeds, m.collateral - liqUnits * liqPick.price) * 100)}. You keep every other share.</div><button className="btn btn-d btn-s" type="button" style={{ marginTop: 10 }} onClick={() => { dispatch({ type: 'LIQUIDATE', id: loan.id, ticker: liqPick.ticker, units: liqUnits, proceeds: Math.round(liqProceeds) }); toast('Demo: forced sale recorded', 'bad') }}>Demo: run the forced sale</button></div>}
            <div className="card"><h2 style={{ fontSize: 15 }}>Coming next</h2><div className="stack" style={{ gap: 8, marginTop: 10, fontSize: 13 }}>{['Stress test: what if my shares fall 20%?', 'Borrow more when your shares rise', 'Release some shares once the loan is small'].map(t => <div className="rowline" key={t}><span>{t}</span><Pill>Phase 2</Pill></div>)}</div></div>
            <div className="card" style={{ background: 'var(--paper)' }}><h2 style={{ fontSize: 14 }}>Demo controls</h2><p className="muted xs" style={{ marginTop: 4 }}>Move the market to see the warning and call states.</p><div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>{[[0, 'Normal'], [0.56, 'Fall 56% (warning)'], [0.62, 'Fall 62% (call)']].map(([v, l]) => <button key={v} type="button" className="btn btn-s" style={{ background: s.marketShock === v ? 'var(--ink)' : '#fff', color: s.marketShock === v ? '#fff' : 'var(--ink)', border: '1px solid var(--line)' }} onClick={() => dispatch({ type: 'SETTINGS', patch: { marketShock: v } })}>{l}</button>)}</div></div>
          </div>
        </div>

        <div className="card tight">
          <div className="card-head"><h2>Repayment schedule</h2></div>
          <div className="scroll"><table className="tbl"><thead><tr><th>#</th><th>Date</th><th className="num">Payment</th><th className="num">Interest</th><th className="num">Principal</th><th className="num">Balance after</th><th>Status</th></tr></thead><tbody>
            {m.schedule.map(r => <tr key={r.n}><td>{r.n}</td><td>{fmtDate(r.date)}</td><td className="num">{naira(r.payment)}</td><td className="num">{naira(r.interest)}</td><td className="num">{naira(r.principal)}</td><td className="num">{naira(r.balance)}</td><td>{r.status === 'Paid' ? <Pill kind="good">Paid</Pill> : r.n === loan.tenor ? <Pill>Lien lifts</Pill> : <Pill>Scheduled</Pill>}</td></tr>)}
          </tbody></table></div>
        </div>
      </div>
      {modal === 'repay' && <Modal title="Confirm repayment" onClose={() => setModal(null)}><div className="kv"><span className="muted">Amount</span><strong>{naira(Math.min(repay, Math.ceil(payoff)))}</strong></div><div className="kv"><span className="muted">Pay from</span><strong>Vendii cash ({naira(state.cash.settled)} available)</strong></div><p className="muted small" style={{ marginTop: 10 }}>You can also transfer to {state.user.virtualAccount.number}; it applies the moment it lands.</p><div style={{ display: 'flex', gap: 10, marginTop: 16 }}><button className="btn btn-o" type="button" onClick={() => setModal(null)}>Back</button><button className="btn btn-p" type="button" onClick={() => doRepay(repay, true)}>Repay</button></div></Modal>}
      {modal === 'pledge' && unpledged[0] && <Modal title={`Pledge ${unpledged[0].ticker}`} onClose={() => setModal(null)}><p className="small">Adds {n0(unpledged[0].units)} {unpledged[0].ticker} worth {naira(unpledged[0].units * priceOf(unpledged[0].ticker, s))} to the lien. CSCS sends a code to {state.user.phone}.</p><input className="inp" inputMode="numeric" maxLength="6" placeholder="••••••" style={{ maxWidth: 180, letterSpacing: '.3em', marginTop: 12 }} aria-label="CSCS code" /><div style={{ display: 'flex', gap: 10, marginTop: 16 }}><button className="btn btn-o" type="button" onClick={() => setModal(null)}>Back</button><button className="btn btn-p" type="button" onClick={() => { dispatch({ type: 'PLEDGE_MORE', id: loan.id, item: { ticker: unpledged[0].ticker, units: unpledged[0].units } }); toast('Lien extended', 'good'); setModal(null) }}>Confirm pledge</button></div></Modal>}
    </>
  )
}
