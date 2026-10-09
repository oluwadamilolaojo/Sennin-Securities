import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { TopBar } from '../../layouts/Shell.jsx'
import { useStore } from '../../store/store.jsx'
import { Pill, Modal } from '../../components/ui.jsx'
import { naira, n0, fmtDate, uid, daysBetween } from '../../utils.js'
import { BOND_WINDOW } from '../../data/mock.js'

export default function FixedIncome() {
  const { state, dispatch, toast } = useStore()
  const [tenor, setTenor] = useState(3)
  const [amount, setAmount] = useState(100000)
  const [confirm, setConfirm] = useState(false)
  const amt = Number(amount) || 0
  const bad = amt < 5000 || amt % 1000 !== 0 || amt > 50000000
  const rate = BOND_WINDOW.rates[tenor] / 100
  const units = Math.floor(amt / 1000)
  const notEnough = amt > state.cash.settled
  const closesIn = Math.max(0, daysBetween(new Date().toISOString(), BOND_WINDOW.closes))
  function subscribe() {
    dispatch({ type: 'SUBSCRIBE_BOND', bond: { id: uid('b'), name: 'FGN Savings Bond', issue: BOND_WINDOW.month, tenor, rate: BOND_WINDOW.rates[tenor], units, amount: amt, issued: BOND_WINDOW.settles, matures: BOND_WINDOW.matures[tenor], nextCoupon: BOND_WINDOW.firstCoupon } })
    setConfirm(false); toast('Subscribed. Allotment confirmed on settlement day.', 'good')
  }
  const invested = state.bonds.reduce((s, b) => s + b.amount, 0)
  const coupons = state.bonds.flatMap(b => { const out = []; let d = new Date(b.nextCoupon); for (let i = 0; i < 4; i++) { out.push({ date: d.toISOString(), amount: b.amount * b.rate / 100 / 4, name: b.name + ' ' + b.issue }); d = new Date(d); d.setMonth(d.getMonth() + 3) } return out }).sort((a, b) => a.date.localeCompare(b.date))
  return (
    <>
      <TopBar title="Fixed income"><span className="muted small">Government-backed, tax-free coupons, from ₦5,000</span></TopBar>
      <div className="content">
        <div className="grid g3" style={{ alignItems: 'start' }}>
          <div className="card ink span2">
            <div className="row" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div>
                <div style={{ color: 'var(--gold)', fontWeight: 600, fontSize: 13 }}>{BOND_WINDOW.month} window is open</div>
                <h2 style={{ fontSize: 24, marginTop: 6 }}>FGN Savings Bond</h2>
                <p className="muted" style={{ marginTop: 6, maxWidth: '38em' }}>Issued monthly by the Debt Management Office and backed by the Federal Government. Interest is paid every quarter into your bank account; principal returns at maturity. ₦1,000 per unit, minimum ₦5,000, maximum ₦50m.</p>
              </div>
              <div style={{ textAlign: 'right' }}><div className="muted small">Closes in</div><div style={{ fontSize: 34, fontWeight: 700 }}>{closesIn} days</div><div className="muted small">{fmtDate(BOND_WINDOW.closes)}, 5pm · Settles {fmtDate(BOND_WINDOW.settles)}</div></div>
            </div>
            <div className="grid g2" style={{ marginTop: 20, gap: 14 }}>
              {[2, 3].map(t => <div key={t} style={{ background: 'var(--blue-dk)', borderRadius: 10, padding: 16 }}><div className="muted small">{t}-year bond</div><div style={{ fontSize: 30, fontWeight: 700 }}>{BOND_WINDOW.rates[t]}%</div><div className="muted small">per year · matures {fmtDate(BOND_WINDOW.matures[t])}</div></div>)}
            </div>
            <div className="muted small" style={{ marginTop: 16 }}>Rates are set by the DMO each month. Sample figures shown. <Link to="/learn" style={{ color: 'var(--gold)' }}>How does a savings bond compare to a fixed deposit?</Link></div>
          </div>
          <div className="card">
            <h2 style={{ fontSize: 17 }}>Subscribe</h2>
            <div style={{ marginTop: 14 }}><span className="lbl">Tenor</span>
              <div style={{ display: 'flex', gap: 10 }}>{[2, 3].map(t => <button key={t} type="button" className={'opt' + (tenor === t ? ' on' : '')} onClick={() => setTenor(t)}><div style={{ fontWeight: 700, fontSize: 16 }}>{t} years</div><div className="muted xs">{BOND_WINDOW.rates[t]}%</div></button>)}</div></div>
            <div style={{ marginTop: 14 }}><label className="lbl" htmlFor="ba">Amount (multiples of ₦1,000, from ₦5,000)</label><input id="ba" className="inp" type="number" step="1000" min="5000" value={amount} onChange={e => setAmount(e.target.value)} />{bad && <div className="alert warn" style={{ marginTop: 8 }}>Enter between ₦5,000 and ₦50,000,000 in multiples of ₦1,000.</div>}{notEnough && !bad && <div className="alert bad" style={{ marginTop: 8 }}>Settled cash is {naira(state.cash.settled)}. <Link to="/app/funding">Add money</Link></div>}</div>
            <div style={{ marginTop: 16, padding: 14, background: 'var(--paper)', borderRadius: 10 }}>
              <div className="kv"><span className="muted">Units</span><span className="num">{n0(units)}</span></div>
              <div className="kv"><span className="muted">Every quarter you receive</span><strong className="num">{naira(amt * rate / 4)}</strong></div>
              <div className="kv"><span className="muted">First coupon</span><span>{fmtDate(BOND_WINDOW.firstCoupon)}</span></div>
              <div className="kv"><span className="muted">Total interest over the term</span><span className="num">{naira(amt * rate * tenor)}</span></div>
              <div className="kv"><span className="muted">Fees</span><span>None</span></div>
              <div className="kv tot"><span>You pay on {fmtDate(BOND_WINDOW.settles)}</span><span className="num">{naira(amt)}</span></div>
            </div>
            <div className="muted xs" style={{ marginTop: 10 }}>Coupons are tax free and land in your bank account. You can sell before maturity on the exchange, though buyers can take time to find.</div>
            <button className="btn btn-g btn-block btn-l" type="button" style={{ marginTop: 14 }} disabled={bad || notEnough} onClick={() => setConfirm(true)}>Subscribe {naira(amt)}</button>
          </div>
        </div>
        <div className="grid g2">
          <div className="card tight">
            <div className="card-head"><h2>Your fixed income</h2><span className="muted small">{naira(invested)} invested</span></div>
            <div className="scroll"><table className="tbl"><thead><tr><th>Instrument</th><th className="num">Units</th><th className="num">Rate</th><th>Next coupon</th><th>Matures</th></tr></thead><tbody>
              {state.bonds.map(b => <tr key={b.id}><td><strong>{b.name}</strong><div className="muted xs">{b.issue} issue, {b.tenor} year</div></td><td className="num">{b.units}</td><td className="num">{b.rate}%</td><td>{fmtDate(b.nextCoupon)} · {naira(b.amount * b.rate / 100 / 4)}</td><td>{fmtDate(b.matures)}</td></tr>)}
            </tbody></table></div>
            <div className="card-foot"><span>Coupon calendar, next 12 months</span><span style={{ marginLeft: 'auto' }}>{coupons.slice(0, 4).map(c => <span key={c.date + c.name} style={{ marginRight: 14 }}>{fmtDate(c.date)} <strong>{naira(c.amount)}</strong></span>)}</span></div>
          </div>
          <div className="stack">
            <div className="card"><div className="row" style={{ alignItems: 'flex-start' }}><div><h2 style={{ fontSize: 17 }}>Treasury bills</h2><p className="muted small" style={{ marginTop: 4 }}>Direct T-bill auctions need over ₦50m. Vendii pools smaller amounts through a partner fund so you earn T-bill yields from ₦10,000.</p></div><Pill>Phase 2</Pill></div></div>
            <div className="card"><div className="row" style={{ alignItems: 'flex-start' }}><div><h2 style={{ fontSize: 17 }}>Listed FGN bonds, secondary market</h2><p className="muted small" style={{ marginTop: 4 }}>Buy bonds already issued, at today's yield, with a built-in yield and accrued interest calculator.</p></div><Pill>Phase 2</Pill></div></div>
            <div className="card"><div className="row" style={{ alignItems: 'flex-start' }}><div><h2 style={{ fontSize: 17 }}>Money market and mutual funds</h2><p className="muted small" style={{ marginTop: 4 }}>Subscribe to and redeem funds from licensed managers. Money market funds become the home for idle cash.</p></div><Pill>Phase 2</Pill></div></div>
          </div>
        </div>
      </div>
      {confirm && <Modal title="Confirm subscription" onClose={() => setConfirm(false)}><div className="kv"><span className="muted">Bond</span><strong>FGN Savings Bond, {tenor} year at {BOND_WINDOW.rates[tenor]}%</strong></div><div className="kv"><span className="muted">Units</span><strong>{n0(units)}</strong></div><div className="kv tot"><span>You pay</span><strong>{naira(amt)}</strong></div><p className="muted small" style={{ marginTop: 12 }}>Cash is reserved now and paid on settlement day. Allotment is confirmed by the DMO.</p><div style={{ display: 'flex', gap: 10, marginTop: 16 }}><button className="btn btn-o" type="button" onClick={() => setConfirm(false)}>Back</button><button className="btn btn-g" type="button" onClick={subscribe}>Confirm</button></div></Modal>}
    </>
  )
}
