import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { TopBar } from '../../layouts/Shell.jsx'
import { useStore, portfolio } from '../../store/store.jsx'
import { Pill, Switch, Modal } from '../../components/ui.jsx'
import { naira, fmtDate, uid } from '../../utils.js'
import { STOCKS } from '../../data/mock.js'

export default function Funding() {
  const { state, dispatch, toast } = useStore()
  const [w, setW] = useState(100000)
  const [dep, setDep] = useState(false)
  const [otp, setOtp] = useState('')
  const [confirmW, setConfirmW] = useState(false)
  const [plan, setPlan] = useState({ ticker: 'STANBICETF30', amount: 50000, day: 28 })
  const p = portfolio(state)
  const wd = Number(w) || 0
  const flags = state.settings.flags
  return (
    <>
      <TopBar title="Funding and withdrawals"><span className="muted small">Cash is held with Trust Bank Securities and never mixed with Vendii's own money</span></TopBar>
      <div className="content">
        <div className="grid g3" style={{ alignItems: 'start' }}>
          <div className="stack">
            <div className="card">
              <h2 style={{ fontSize: 17 }}>Add money</h2>
              <p className="muted small" style={{ marginTop: 4 }}>Transfer from any Nigerian bank app. Money shows within minutes.</p>
              <div style={{ marginTop: 14, padding: 16, background: 'var(--ink)', borderRadius: 10, color: '#fff' }}>
                <div className="xs" style={{ color: '#C9D6E4' }}>Your Vendii account number</div>
                <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '.04em' }} className="num">{state.user.virtualAccount.number}</div>
                <div className="small" style={{ color: '#C9D6E4', marginTop: 4 }}>{state.user.virtualAccount.bank} · Account name: {state.user.name} / Vendii</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}><button className="btn btn-g btn-s" type="button" onClick={() => { navigator.clipboard?.writeText(state.user.virtualAccount.number.replace(/\s/g, '')); toast('Account number copied') }}>Copy number</button><button className="btn btn-s" type="button" style={{ background: 'var(--blue-dk)', color: '#fff' }} onClick={() => setDep(true)}>Simulate a transfer</button></div>
              </div>
              <div className="rowline" style={{ marginTop: 12 }}><span>Pay with debit card</span><Pill>Phase 2</Pill></div>
            </div>
            <div className="card">
              <h2 style={{ fontSize: 17 }}>Withdraw</h2>
              <div style={{ marginTop: 14 }}><label className="lbl" htmlFor="w">Amount (settled cash: {naira(state.cash.settled)})</label><input id="w" className="inp" type="number" step="1000" value={w} onChange={e => setW(e.target.value)} /></div>
              <div style={{ marginTop: 12 }}><span className="lbl">To</span><div className="rowline"><span><strong>{state.user.bank.name} ••{state.user.bank.last4}</strong><div className="muted xs">{state.user.name} · matches your BVN</div></span><Link to="/app/settings?tab=bank" className="xs">Change</Link></div></div>
              <div className="muted xs" style={{ marginTop: 10 }}>Withdrawals go only to an account in your name. Changing it needs a code from your phone and takes effect after 24 hours. Money lands within 2 working hours or we tell you why.</div>
              {wd > state.cash.settled && <div className="alert bad" style={{ marginTop: 8 }}>That's more than your settled cash. {state.cash.unsettled > 0 ? `₦${state.cash.unsettled.toLocaleString()} more settles ${fmtDate(state.cash.unsettledDate)}.` : ''}</div>}
              <button className="btn btn-p btn-block" type="button" style={{ marginTop: 14 }} disabled={wd <= 0 || wd > state.cash.settled} onClick={() => setConfirmW(true)}>Withdraw {naira(wd)}</button>
            </div>
          </div>
          <div className="stack">
            <div className="card">
              <h2 style={{ fontSize: 17 }}>Cash</h2>
              <div style={{ fontSize: 30, fontWeight: 700, marginTop: 6 }} className="num">{naira(state.cash.settled + state.cash.unsettled)}</div>
              <div className="stack" style={{ gap: 8, marginTop: 12 }}>
                <div className="rowline"><span>Settled, can withdraw</span><strong>{naira(state.cash.settled)}</strong></div>
                <div className="rowline"><span>Settling<div className="muted xs">lands {fmtDate(state.cash.unsettledDate)}</div></span><strong>{naira(state.cash.unsettled)}</strong></div>
                <div className="rowline"><span>Reserved for open buy orders</span><strong>{naira(p.reserved)}</strong></div>
              </div>
            </div>
            <div className="card">
              <div className="row" style={{ alignItems: 'flex-start' }}><div><h2 style={{ fontSize: 17 }}>Idle cash earns</h2><p className="muted small" style={{ marginTop: 2 }}>Settled cash sweeps into a partner money market fund each evening and comes back when you trade. Current yield 18.2%.</p></div>{!flags.mmfSweep && <Pill>Phase 2</Pill>}</div>
              <div className="rowline" style={{ marginTop: 12 }}><span>Sweep on</span>{flags.mmfSweep ? <Switch on={state.cash.sweep} onChange={() => { dispatch({ type: 'TOGGLE_SWEEP' }); toast(state.cash.sweep ? 'Sweep off' : 'Sweep on from tonight') }} label="Sweep" /> : <Switch on={false} onChange={() => toast('Opens in Phase 2')} label="Sweep" />}</div>
            </div>
            <div className="card">
              <div className="row"><h2 style={{ fontSize: 17 }}>Recurring investments</h2>{!flags.recurring && <Pill>Phase 2</Pill>}</div>
              <div className="stack" style={{ gap: 8, marginTop: 12 }}>
                {state.recurring.map(r => <div className="rowline" key={r.id}><span><strong>{naira(r.amount)}</strong> into {r.ticker}<div className="muted xs">{r.day}th monthly · NIBSS direct debit from {state.user.bank.name} ••{state.user.bank.last4}</div></span><button className="linkbtn" type="button" onClick={() => dispatch({ type: 'REMOVE_RECURRING', id: r.id })}>Stop</button></div>)}
                {!state.recurring.length && <div className="muted small">No plans yet.</div>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 12 }}>
                <select className="inp" style={{ height: 40 }} value={plan.ticker} onChange={e => setPlan({ ...plan, ticker: e.target.value })} aria-label="Security">{STOCKS.filter(s => s.liquidity !== 'Thin').map(s => <option key={s.ticker}>{s.ticker}</option>)}<option>FGN Savings Bond</option></select>
                <input className="inp" style={{ height: 40 }} type="number" step="5000" value={plan.amount} onChange={e => setPlan({ ...plan, amount: Number(e.target.value) })} aria-label="Amount" />
                <button className="btn btn-o btn-s" type="button" onClick={() => { if (!flags.recurring) { toast('Opens in Phase 2'); return } dispatch({ type: 'ADD_RECURRING', plan: { ...plan, id: uid('rp') } }); toast('Plan added') }}>Add plan</button>
              </div>
            </div>
          </div>
          <div className="stack">
            <div className="card">
              <h2 style={{ fontSize: 17 }}>Security</h2>
              <div className="stack" style={{ gap: 8, marginTop: 12 }}>
                <div className="rowline"><span>Fingerprint or face to open</span><Switch on={state.user.security.biometric} onChange={() => dispatch({ type: 'SET_SECURITY', patch: { biometric: !state.user.security.biometric } })} label="Biometric" /></div>
                <div className="rowline"><span>PIN for every trade and withdrawal</span><Pill kind="good">Always on</Pill></div>
                <div className="rowline"><span>Trusted devices<div className="muted xs">{state.user.security.devices.join(', ')}</div></span><Link to="/app/settings?tab=security" className="xs">Manage</Link></div>
                <div className="rowline"><span>Log out after 10 minutes idle</span><Switch on={state.user.security.timeout} onChange={() => dispatch({ type: 'SET_SECURITY', patch: { timeout: !state.user.security.timeout } })} label="Timeout" /></div>
                <div className="rowline" style={{ background: 'var(--bad-bg)' }}><span style={{ color: 'var(--bad)', fontWeight: 600 }}>Freeze my account now</span><Pill>Phase 2</Pill></div>
              </div>
            </div>
            <div className="card tight">
              <div className="card-head"><h2>Cash activity</h2></div>
              <div className="scroll"><table className="tbl"><thead><tr><th>Date</th><th>Activity</th><th className="num">Amount</th></tr></thead><tbody>
                {[['6 Oct', 'Sale proceeds, NAHCO (settling)', '+₦48,500', ''], ['3 Oct', 'Bought GTCO', '-₦73,215', ''], ['1 Oct', 'Transfer in from GTBank', '+₦200,000', ''], ['29 Sep', 'Recovered dividend, Nestle (paid to GTBank)', '₦41,200 to bank', 'muted'], ['30 Sep', 'Vendii success fee (10%), NIBSS debit', '₦4,120 from bank', 'muted']].map(([d, a, v, c]) => <tr key={a}><td>{d}</td><td>{a}</td><td className={'num ' + c}>{v}</td></tr>)}
              </tbody></table></div>
            </div>
          </div>
        </div>
      </div>
      {dep && <Modal title="Simulate a bank transfer" onClose={() => setDep(false)}><p className="muted small">In production this happens when money lands on your virtual account. Here, pick an amount.</p><div style={{ display: 'flex', gap: 8, marginTop: 12 }}>{[50000, 200000, 1000000].map(a => <button key={a} className="btn btn-o" type="button" onClick={() => { dispatch({ type: 'DEPOSIT', amount: a }); toast(naira(a) + ' received', 'good'); setDep(false) }}>{naira(a)}</button>)}</div></Modal>}
      {confirmW && <Modal title="Confirm withdrawal" onClose={() => setConfirmW(false)}><div className="kv"><span className="muted">Amount</span><strong>{naira(wd)}</strong></div><div className="kv"><span className="muted">To</span><strong>{state.user.bank.name} ••{state.user.bank.last4}</strong></div><div style={{ marginTop: 14 }}><label className="lbl" htmlFor="otp">Code sent to {state.user.phone}</label><input id="otp" className="inp" inputMode="numeric" maxLength="6" value={otp} onChange={e => setOtp(e.target.value)} placeholder="••••••" style={{ maxWidth: 180, letterSpacing: '.3em' }} /></div><div style={{ display: 'flex', gap: 10, marginTop: 16 }}><button className="btn btn-o" type="button" onClick={() => setConfirmW(false)}>Back</button><button className="btn btn-p" type="button" onClick={() => { if (otp.length < 6) { toast('Enter the 6-digit code', 'bad'); return } dispatch({ type: 'WITHDRAW', amount: wd }); toast('Withdrawal sent. Lands within 2 working hours.', 'good'); setConfirmW(false); setOtp('') }}>Withdraw</button></div><div className="muted xs" style={{ marginTop: 8 }}>Demo: any 6 digits work.</div></Modal>}
    </>
  )
}
