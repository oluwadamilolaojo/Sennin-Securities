import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { TopBar } from '../../layouts/Shell.jsx'
import { useStore, upcomingDividends, portfolio } from '../../store/store.jsx'
import { Pill, Tabs, statusPill, Modal } from '../../components/ui.jsx'
import { naira, n2, fmtDate, pct } from '../../utils.js'
import { REGISTRARS } from '../../data/mock.js'

const STEPS = ['Found', 'Identity', 'With registrar', 'Approved', 'Paid']

export default function Dividends() {
  const { state, dispatch, toast } = useStore()
  const [sp] = useSearchParams()
  const [tab, setTab] = useState(sp.get('tab') || 'tracker')
  const [upload, setUpload] = useState(null)
  const up = upcomingDividends(state)
  const p = portfolio(state)
  const mine = state.claims.filter(c => c.owner === 'u-1')
  const recovering = mine.filter(c => c.status !== 'Paid')
  const paid = mine.filter(c => c.status === 'Paid')
  const coming60 = up.filter(d => (new Date(d.pay) - new Date()) / 86400000 < 60)
  const yieldOnPortfolio = p.equity > 0 ? p.divsAll / p.equity * 100 : 0
  return (
    <>
      <TopBar title="Dividends"><Link className="btn btn-o btn-s" to="/check">Scan for more unclaimed dividends</Link></TopBar>
      <div className="content">
        <div className="grid g4">
          <div className="stat"><div className="lab">Received in 2026</div><div className="val">{naira(p.divsAll)}</div><div className="sub">after 10% withholding tax</div></div>
          <div className="stat"><div className="lab">Coming in the next 60 days</div><div className="val">{naira(coming60.reduce((s, d) => s + d.net, 0))}</div><div className="sub">{coming60.length} payments</div></div>
          <div className="stat ink"><div className="lab">Unclaimed, being recovered</div><div className="val">{naira(recovering.reduce((s, c) => s + c.amount, 0))}</div><div className="sub">{naira(paid.reduce((s, c) => s + c.amount, 0))} already paid to your bank</div></div>
          <div className="stat"><div className="lab">Dividend yield on portfolio</div><div className="val">{pct(yieldOnPortfolio)}</div><div className="sub">trailing 12 months</div></div>
        </div>
        <div className="card tight">
          <Tabs tabs={[{ value: 'tracker', label: 'Dividend tracker' }, { value: 'recovery', label: `Recovery (${recovering.length} open)` }, { value: 'mandates', label: 'E-dividend mandates' }, { value: 'history', label: 'Paid history' }]} value={tab} onChange={setTab} />
          {tab === 'tracker' && (
            <>
              <div className="scroll"><table className="tbl"><thead><tr><th>Security</th><th>Dividend</th><th className="num">Per unit</th><th>Qualification</th><th>Payment</th><th className="num">Gross</th><th className="num">WHT 10%</th><th className="num">You receive</th><th>Status</th></tr></thead><tbody>
                {up.map(d => <tr key={d.ticker + d.type}><td><strong>{d.ticker}</strong></td><td>{d.type}</td><td className="num">₦{n2(d.amount)}</td><td>{fmtDate(d.qual)}</td><td>{fmtDate(d.pay)}</td><td className="num">{naira(d.gross)}</td><td className="num">{naira(d.wht)}</td><td className="num"><strong>{naira(d.net)}</strong></td><td>{new Date(d.qual) > new Date() ? <Pill kind="info">Hold until {fmtDate(d.qual)}</Pill> : <Pill kind="info">You qualify</Pill>}</td></tr>)}
                {state.bonds.map(b => <tr key={b.id}><td><strong>FGN Savings Bond</strong></td><td>Quarterly coupon</td><td className="num">₦{n2(1000 * b.rate / 100 / 4)}</td><td>n/a</td><td>{fmtDate(b.nextCoupon)}</td><td className="num">{naira(b.amount * b.rate / 100 / 4)}</td><td className="num">₦0</td><td className="num"><strong>{naira(b.amount * b.rate / 100 / 4)}</strong></td><td><Pill kind="info">Tax free</Pill></td></tr>)}
              </tbody></table></div>
              <div className="card-foot"><span>Reinvest dividends automatically into the same stock</span><Pill>Phase 3</Pill><span style={{ marginLeft: 'auto' }}>Own the shares before the qualification date to get the dividend.</span></div>
            </>
          )}
          {tab === 'recovery' && (
            <>
              <div style={{ padding: '14px 20px 0' }} className="muted small">We found these using your BVN, NIN and the names on your old share certificates. You signed one power of attorney; we chase each registrar. Payment goes straight to your bank. Our {Math.round(state.settings.recoveryFee * 100)}% fee is debited after you're paid.</div>
              <div className="scroll"><table className="tbl"><thead><tr><th>Company</th><th>Registrar</th><th>Dividend years</th><th className="num">Amount</th><th>Progress</th><th>Status</th><th></th></tr></thead><tbody>
                {mine.map(c => (
                  <tr key={c.id}><td><strong>{c.company}</strong><div className="muted xs">{c.id}</div></td><td>{c.registrar}</td><td>{c.years}</td><td className="num">{naira(c.amount)}</td>
                    <td><div style={{ display: 'flex', gap: 4 }}>{STEPS.map((s, i) => <span key={s} title={s} style={{ flex: 1, height: 6, borderRadius: 3, background: i < c.step ? (c.status === 'Action needed' && i === c.step - 1 ? 'var(--gold)' : 'var(--good)') : 'var(--soft)' }} />)}</div><div className="muted xs" style={{ marginTop: 4 }}>{c.note}</div></td>
                    <td>{statusPill(c.status)}</td>
                    <td>{c.status === 'Action needed' ? <button className="btn btn-g btn-s" type="button" onClick={() => setUpload(c)}>Upload old certificate</button> : c.status === 'Paid' ? <button className="linkbtn" type="button" onClick={() => toast('Receipt ' + c.id + '.pdf downloading')}>Receipt</button> : <span className="muted xs">Updated {fmtDate(c.updated)}</span>}</td></tr>
                ))}
              </tbody></table></div>
              <div className="card-foot"><span><strong>How it works:</strong> 1 Sign POA once · 2 We verify your identity with the registrar · 3 Registrar pays your bank · 4 We debit {Math.round(state.settings.recoveryFee * 100)}% by NIBSS mandate</span><button className="linkbtn" type="button" style={{ marginLeft: 'auto' }} onClick={() => toast('Signed POA downloading')}>View your signed POA</button></div>
            </>
          )}
          {tab === 'mandates' && (
            <div style={{ padding: 20 }} className="grid g2">
              <div>
                <p className="muted small">A mandate tells the registrar to pay future dividends into your bank. We pre-fill the form with your BVN, photo and signature; you review and tap submit.</p>
                <div className="stack" style={{ gap: 8, marginTop: 14 }}>
                  {state.mandates.map(m => <div className="rowline" key={m.registrar}><span>{m.registrar}</span>{m.status === 'Needed' ? <button className="btn btn-g btn-s" type="button" onClick={() => { dispatch({ type: 'SUBMIT_MANDATE', registrar: m.registrar }); toast('Mandate submitted to ' + m.registrar, 'good') }}>Fill and submit</button> : statusPill(m.status)}</div>)}
                </div>
              </div>
              <div className="card" style={{ background: 'var(--paper)' }}>
                <h3 style={{ fontSize: 16 }}>All 21 registrars</h3>
                <p className="muted small" style={{ marginTop: 6 }}>Mandates are needed only where you hold shares. Add one for any registrar below.</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>{REGISTRARS.map(r => <Pill key={r} kind={state.mandates.find(m => m.registrar === r && m.status === 'Active') ? 'good' : 'grey'}>{r}</Pill>)}</div>
              </div>
            </div>
          )}
          {tab === 'history' && (
            <div className="scroll"><table className="tbl"><thead><tr><th>Security</th><th>Dividend</th><th className="num">Per unit</th><th>Paid</th><th className="num">Gross</th><th className="num">WHT</th><th className="num">Net</th><th>Where</th></tr></thead><tbody>
              {state.paidDividends.map((d, i) => <tr key={i}><td><strong>{d.ticker}</strong></td><td>{d.type}</td><td className="num">₦{n2(d.perUnit)}</td><td>{fmtDate(d.pay)}</td><td className="num">{naira(d.gross)}</td><td className="num">{naira(d.wht)}</td><td className="num"><strong>{naira(d.net)}</strong></td><td><Pill kind="good">Paid to {state.user.bank.name} ••{state.user.bank.last4}</Pill></td></tr>)}
            </tbody></table></div>
          )}
        </div>
        <div className="card" style={{ borderColor: 'var(--gold)' }}>
          <div className="row"><div><div style={{ fontWeight: 600 }}>Who gets these if something happens to you?</div><div className="muted small">Named beneficiary: <strong style={{ color: 'var(--ink)' }}>{state.user.beneficiary.name}</strong> ({state.user.beneficiary.relationship}). Last confirmed {fmtDate(state.user.beneficiary.confirmed)}.</div></div><Link to="/app/settings?tab=beneficiary" className="btn btn-o btn-s">Update beneficiary</Link></div>
        </div>
      </div>
      {upload && <Modal title={`Upload certificate for ${upload.company}`} onClose={() => setUpload(null)}><p className="muted small">{upload.registrar} wants a photo of the original share certificate or dividend warrant. Any clear phone photo works.</p><input className="inp" type="file" style={{ marginTop: 12, paddingTop: 10 }} aria-label="Certificate file" /><div style={{ display: 'flex', gap: 10, marginTop: 16 }}><button className="btn btn-o" type="button" onClick={() => setUpload(null)}>Back</button><button className="btn btn-p" type="button" onClick={() => { dispatch({ type: 'UPLOAD_CLAIM_DOC', id: upload.id }); toast('Sent to the registrar', 'good'); setUpload(null) }}>Send to registrar</button></div></Modal>}
    </>
  )
}
