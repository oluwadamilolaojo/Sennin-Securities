import React from 'react'
import { TopBar } from '../../layouts/Shell.jsx'
import { useStore } from '../../store/store.jsx'
import { Switch, Field } from '../../components/ui.jsx'
import { pct, naira } from '../../utils.js'

export default function AdminSettings() {
  const { state, dispatch, toast } = useStore()
  const s = state.settings
  const num = (k, scale = 1) => ({ value: s[k] * scale, onChange: e => dispatch({ type: 'SETTINGS', patch: { [k]: Number(e.target.value) / scale } }) })
  const FLAGS = [['trading', 'Trading', 'Launch'], ['recovery', 'Dividend recovery', 'Launch'], ['lending', 'Share-backed lending', 'Mar 2027'], ['mmfSweep', 'Money market sweep for idle cash', 'Phase 2'], ['recurring', 'Recurring investments', 'Phase 2'], ['ipo', 'IPO and public offer subscriptions (SEC-approved only)', 'Phase 2'], ['realtimePrices', 'Real-time NGX prices', 'Phase 2']]
  return (
    <>
      <TopBar title="Fees, rates and feature flags" plain><button className="btn btn-d btn-s" type="button" onClick={() => { if (confirm('Reset all demo data?')) { dispatch({ type: 'RESET' }); toast('Demo data reset') } }}>Reset demo data</button></TopBar>
      <div className="content">
        <div className="grid g3" style={{ alignItems: 'start' }}>
          <div className="card"><h2 style={{ fontSize: 17 }}>Trading charges</h2><div className="stack" style={{ gap: 12, marginTop: 12 }}>
            {[['commission', 'Brokerage commission %'], ['secFee', 'SEC fee %'], ['ngxFee', 'NGX fee %'], ['cscsFee', 'CSCS fee %'], ['stampDuty', 'Stamp duty %'], ['vat', 'VAT on fees %']].map(([k, l]) => <Field key={k} label={l} id={k}><input id={k} className="inp" type="number" step="0.005" {...num(k, 100)} /></Field>)}
            <Field label="Recovery success fee %" id="recoveryFee"><input id="recoveryFee" className="inp" type="number" step="1" {...num('recoveryFee', 100)} /></Field>
          </div></div>
          <div className="card"><h2 style={{ fontSize: 17 }}>Lending rules</h2><div className="stack" style={{ gap: 12, marginTop: 12 }}>
            <Field label="Interest rate % a year" id="loanRate"><input id="loanRate" className="inp" type="number" step="0.5" {...num('loanRate', 100)} /></Field>
            <Field label="Arrangement fee %" id="arrangementFee"><input id="arrangementFee" className="inp" type="number" step="0.5" {...num('arrangementFee', 100)} /></Field>
            <Field label="CSCS lien fee ₦" id="lienFee"><input id="lienFee" className="inp" type="number" step="500" {...num('lienFee')} /></Field>
            <Field label="Warning LTV %" id="warnLtv"><input id="warnLtv" className="inp" type="number" step="0.5" {...num('warnLtv', 100)} /></Field>
            <Field label="Margin call LTV %" id="callLtv"><input id="callLtv" className="inp" type="number" step="0.5" {...num('callLtv', 100)} /></Field>
            <Field label="Liquidation LTV %" id="liqLtv"><input id="liqLtv" className="inp" type="number" step="0.5" {...num('liqLtv', 100)} /></Field>
            <Field label="Days to cure a call" id="cureDays"><input id="cureDays" className="inp" type="number" step="1" {...num('cureDays')} /></Field>
            <Field label="Max share of a loan from one stock %" id="maxConcentration"><input id="maxConcentration" className="inp" type="number" step="5" {...num('maxConcentration', 100)} /></Field>
            <Field label="Programme limit ₦" id="programmeLimit"><input id="programmeLimit" className="inp" type="number" step="100000000" {...num('programmeLimit')} /></Field>
          </div></div>
          <div className="stack">
            <div className="card"><h2 style={{ fontSize: 17 }}>Feature flags and kill switches</h2><div className="stack" style={{ gap: 8, marginTop: 12 }}>{FLAGS.map(([k, l, ph]) => <div className="rowline" key={k}><span>{l}<div className="muted xs">{ph}</div></span><Switch on={!!s.flags[k]} onChange={() => dispatch({ type: 'FLAG', key: k, value: !s.flags[k] })} label={l} /></div>)}</div><div className="muted xs" style={{ marginTop: 10 }}>Turning a flag off pauses that product for every customer at once and shows a notice on the status page.</div></div>
            <div className="card"><h2 style={{ fontSize: 17 }}>Market shock (demo)</h2><p className="muted small" style={{ marginTop: 4 }}>Push every price down to see warnings, margin calls and the liquidation flow across the apps.</p><input type="range" min="0" max="0.7" step="0.01" value={s.marketShock} onChange={e => dispatch({ type: 'SETTINGS', patch: { marketShock: Number(e.target.value) } })} aria-label="Market shock" style={{ marginTop: 10 }} /><div className="row"><span className="muted xs">0%</span><strong>{Math.round(s.marketShock * 100)}% fall</strong><span className="muted xs">70%</span></div></div>
            <div className="card"><h2 style={{ fontSize: 17 }}>Live values</h2><div className="stack" style={{ gap: 6, marginTop: 10, fontSize: 13 }}><div className="kv"><span className="muted">All-in charges on a ₦100,000 buy</span><strong>{pct((s.commission + s.secFee + s.ngxFee + s.cscsFee + s.stampDuty + (s.commission + s.ngxFee + s.cscsFee) * s.vat) * 100, 2)}</strong></div><div className="kv"><span className="muted">Recovery fee on ₦100,000</span><strong>{naira(100000 * s.recoveryFee)}</strong></div><div className="kv"><span className="muted">Call trigger as collateral cover</span><strong>{Math.round(1 / s.callLtv * 100)}%</strong></div></div></div>
          </div>
        </div>
      </div>
    </>
  )
}
