import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TopBar } from '../../layouts/Shell.jsx'
import { useStore } from '../../store/store.jsx'
import { Pill } from '../../components/ui.jsx'
import { naira, n0, pct, today, addMonths, fmtDate } from '../../utils.js'

export default function Review() {
  const { state, dispatch, toast } = useStore()
  const nav = useNavigate()
  const d = state.draftLoan
  const s = state.settings
  const [bureau, setBureau] = useState(true)
  const [otp, setOtp] = useState('')
  const [sig, setSig] = useState(state.user.name)
  if (!d) return <><TopBar title="Review and sign" plain /><div className="content"><div className="card">No draft yet. <Link to="/lend/build">Build a loan first</Link>.</div></div></>
  const start = addMonths(today(), 0), end = addMonths(today(), d.tenor)
  const callVal = d.amount / s.callLtv
  function sign() {
    if (!bureau) { toast('The bank needs bureau consent to lend', 'bad'); return }
    if (otp.length < 6) { toast('Enter the 6-digit CSCS code', 'bad'); return }
    if (sig.trim().toLowerCase() !== state.user.name.toLowerCase()) { toast('Type your name exactly as on your BVN', 'bad'); return }
    const loan = { id: 'VBL-2026-' + String(320 + state.loans.length).padStart(5, '0'), owner: 'u-1', ownerName: state.user.name, status: 'Pending approval', amount: d.amount, outstanding: d.amount, rate: s.loanRate, tenor: d.tenor, plan: d.plan, start: null, purpose: d.purpose, collateral: d.collateral, payments: [], alerts: [[today(), 'Application signed. Lien instruction sent to CSCS pending approval.', 'email, app']] }
    dispatch({ type: 'CREATE_LOAN', loan })
    toast('Signed. Trust Bank reviews within one working day.', 'good')
    nav('/lend')
  }
  const K = ({ k, v }) => <div className="kv" style={{ borderBottom: '1px solid var(--soft)', padding: '10px 0' }}><span>{k}</span><strong style={{ textAlign: 'right' }}>{v}</strong></div>
  return (
    <>
      <TopBar title="Review and sign" plain><span className="muted small">Step 2 of 2 · nothing is final until you tap the last button</span></TopBar>
      <div className="content">
        <div className="grid g2" style={{ alignItems: 'start' }}>
          <div className="card" style={{ borderColor: 'var(--ink)' }}>
            <div className="row" style={{ alignItems: 'flex-start' }}><div><div className="muted xs" style={{ fontWeight: 600 }}>Key facts sheet</div><h2 style={{ fontSize: 20, marginTop: 4 }}>Share-backed loan from Trust Bank</h2><div className="muted small">Arranged by Vendii · {fmtDate(today())}</div></div><button className="btn btn-o btn-s" type="button" onClick={() => toast('Key facts sheet downloading')}>Download PDF</button></div>
            <div style={{ marginTop: 16 }}>
              <K k="You borrow" v={naira(d.amount)} />
              <K k="For" v={`${d.tenor} months, ${fmtDate(start)} to ${fmtDate(end)}`} />
              <K k="Interest rate" v={`${Math.round(s.loanRate * 100)}% a year, fixed`} />
              <K k={d.plan === 'Interest only' ? 'Interest each month' : 'You pay each month'} v={naira(d.payment) + ' by direct debit'} />
              <K k="Total interest" v={naira(d.interest)} />
              <K k="Arrangement fee, once" v={naira(d.fee)} />
              <K k="CSCS lien fee" v={naira(d.lien)} />
              <K k="Total you repay" v={naira(d.total)} />
              <K k="Effective annual cost (APR)" v={pct(d.apr)} />
              <K k="Repay early" v="Any day, no charge" />
              <K k="Shares pledged" v={d.collateral.map(c => `${c.ticker} ${n0(c.units)}`).join(' · ') + `, worth ${naira(d.coll)} today`} />
              <K k="Dividends on pledged shares" v="Paid to you as normal" />
              <K k="We warn you" v={`when the loan reaches ${pct(s.warnLtv * 100)} of share value`} />
              <K k="We ask you to add cash or shares" v={`at ${pct(s.callLtv * 100)}, with ${s.cureDays} working days to act`} />
              <K k="Shares may be sold" v={`at ${pct(s.liqLtv * 100, 0)}, or after the ${s.cureDays} days pass unanswered`} />
            </div>
            <div className="alert warn" style={{ marginTop: 14, lineHeight: 1.6 }}><strong>In plain words:</strong> your shares are worth {naira(d.coll)}. If they fall about {Math.max(0, (1 - callVal / d.coll) * 100).toFixed(0)}% to {naira(callVal)}, we ask for roughly {naira(Math.max(0, d.amount - callVal * s.warnLtv))} more. If they fall further and nothing is added, we sell enough to bring the loan back to {pct(s.warnLtv * 100)} and return the rest. A missed monthly payment adds 1% of the overdue amount per month and is reported to credit bureaus after 30 days.</div>
          </div>
          <div className="stack">
            <div className="card">
              <h2 style={{ fontSize: 17 }}>Checks done</h2>
              <div className="stack" style={{ gap: 8, marginTop: 12 }}>
                {[`Name matches across BVN, CSCS and ${state.user.bank.name}: ${state.user.bank.accountName}`, 'None of the pledged shares has an existing lien at CSCS', `No single stock backs more than ${Math.round(s.maxConcentration * 100)}% of the loan`, `Purpose declared: ${d.purpose.toLowerCase()}, not for buying securities`].map(t => <div className="chk" key={t}><span className="up" style={{ fontWeight: 700 }}>✓</span><span>{t}</span></div>)}
              </div>
            </div>
            <div className="card">
              <h2 style={{ fontSize: 17 }}>Three things to do</h2>
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}><div className="wiz on" style={{ width: 30, padding: 0, flex: 'none' }}><div className="d">1</div></div><div style={{ flex: 1 }}><div style={{ fontWeight: 600 }}>Allow a credit bureau check</div><label className="chk" style={{ marginTop: 8 }}><input type="checkbox" checked={bureau} onChange={e => setBureau(e.target.checked)} /><span>Trust Bank may check my record at CRC, FirstCentral or CreditRegistry, and report this loan to them.</span></label></div></div>
              <div style={{ display: 'flex', gap: 12, marginTop: 18 }}><div className="wiz on" style={{ width: 30, padding: 0, flex: 'none' }}><div className="d">2</div></div><div style={{ flex: 1 }}><div style={{ fontWeight: 600 }}>Confirm the lien with CSCS</div><div className="muted small" style={{ marginTop: 2 }}>CSCS sent a 6-digit code to {state.user.phone}. It places a lien on the pledged shares in favour of Trust Bank. The lien lifts automatically when you repay.</div><div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'center' }}><input className="inp" inputMode="numeric" maxLength="6" value={otp} onChange={e => setOtp(e.target.value)} placeholder="••••••" style={{ maxWidth: 180, letterSpacing: '.3em', textAlign: 'center', fontSize: 20 }} aria-label="CSCS code" /><button className="linkbtn" type="button" onClick={() => toast('Code resent')}>Resend code</button></div></div></div>
              <div style={{ display: 'flex', gap: 12, marginTop: 18 }}><div className="wiz on" style={{ width: 30, padding: 0, flex: 'none' }}><div className="d">3</div></div><div style={{ flex: 1 }}><div style={{ fontWeight: 600 }}>Sign the agreement</div><div className="muted small" style={{ marginTop: 2 }}>Type your full name as it appears on your BVN. This counts as your signature on the loan agreement, the NIBSS direct debit mandate for {state.user.bank.name} ••{state.user.bank.last4}, and the key facts sheet.</div><label className="lbl" htmlFor="sig" style={{ marginTop: 10 }}>Full name</label><input id="sig" className="inp" value={sig} onChange={e => setSig(e.target.value)} style={{ fontSize: 18 }} /></div></div>
              <div className="rowline" style={{ marginTop: 18 }}><span>Money goes to <strong>{state.user.bank.name} ••{state.user.bank.last4}</strong> (matches your BVN) within 2 working hours of approval.</span><Pill kind="good">Verified</Pill></div>
              <button className="btn btn-g btn-block btn-l" type="button" style={{ marginTop: 16 }} onClick={sign}>Sign and place the lien</button>
              <div className="muted xs" style={{ marginTop: 10, textAlign: 'center' }}>You'll get the signed documents by email and in-app. <Link to="/lend/build">Go back and change something</Link>. Demo: any 6 digits work as the code.</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
