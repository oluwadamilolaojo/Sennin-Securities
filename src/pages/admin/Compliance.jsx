import React from 'react'
import { TopBar } from '../../layouts/Shell.jsx'
import { useStore } from '../../store/store.jsx'
import { Pill, statusPill } from '../../components/ui.jsx'
import { fmtDate } from '../../utils.js'

export default function Compliance() {
  const { state, dispatch, toast } = useStore()
  return (
    <>
      <TopBar title="Compliance and complaints" plain />
      <div className="content">
        <div className="card tight"><div className="card-head"><h2>AML and fraud flags</h2><span className="muted small">PEP and sanctions screening on signup; transaction monitoring daily</span></div>
          <div className="scroll"><table className="tbl"><thead><tr><th>Flag</th><th>Customer</th><th>Type</th><th>Risk</th><th>Opened</th><th>Status</th><th></th></tr></thead><tbody>
            {state.amlFlags.map(f => <tr key={f.id}><td><strong>{f.id}</strong></td><td>{f.user}</td><td>{f.type}</td><td><Pill kind={f.risk === 'High' ? 'bad' : f.risk === 'Medium' ? 'warn' : 'grey'}>{f.risk}</Pill></td><td>{fmtDate(f.opened)}</td><td>{statusPill(f.status)}</td><td style={{ whiteSpace: 'nowrap' }}>{f.status === 'Open' && <><button className="btn btn-o btn-s" type="button" onClick={() => { dispatch({ type: 'RESOLVE_FLAG', id: f.id, status: 'Resolved' }); toast('Flag cleared and logged') }}>Clear</button> <button className="btn btn-d btn-s" type="button" onClick={() => { dispatch({ type: 'RESOLVE_FLAG', id: f.id, status: 'Escalated to NFIU' }); toast('Suspicious transaction report drafted') }}>Escalate (STR)</button></>}</td></tr>)}
          </tbody></table></div></div>
        <div className="card tight"><div className="card-head"><h2>Complaints register</h2><span className="muted small">Acknowledge within 1 working day; resolve within SEC timelines; escalation path to SEC on every reply</span></div>
          <div className="scroll"><table className="tbl"><thead><tr><th>Ref</th><th>Customer</th><th>Subject</th><th>Channel</th><th>Opened</th><th>Due</th><th>Status</th><th></th></tr></thead><tbody>
            {state.complaints.map(c => <tr key={c.id}><td><strong>{c.id}</strong></td><td>{c.user}</td><td>{c.subject}</td><td>{c.channel}</td><td>{fmtDate(c.opened)}</td><td className={new Date(c.due) < new Date() && c.status !== 'Resolved' ? 'dn' : ''}>{fmtDate(c.due)}</td><td>{statusPill(c.status)}</td><td style={{ whiteSpace: 'nowrap' }}>{c.status === 'Open' && <button className="btn btn-o btn-s" type="button" onClick={() => dispatch({ type: 'COMPLAINT_STATUS', id: c.id, status: 'Investigating' })}>Acknowledge</button>} {c.status !== 'Resolved' && <button className="btn btn-p btn-s" type="button" onClick={() => { dispatch({ type: 'COMPLAINT_STATUS', id: c.id, status: 'Resolved' }); toast('Resolved; customer told how to escalate if unhappy') }}>Resolve</button>}</td></tr>)}
          </tbody></table></div></div>
        <div className="grid g2">
          <div className="card"><h2 style={{ fontSize: 17 }}>Regulatory reporting pack</h2><div className="stack" style={{ gap: 8, marginTop: 12 }}>{['Monthly return to SEC (digital sub-broker)', 'Client money reconciliation (daily)', 'CSCS positions vs ledger (daily)', 'Complaints log extract', 'NFIU suspicious transaction reports', 'Lending exposure report for Trust Bank'].map(r => <div className="rowline" key={r}><span>{r}</span><button className="linkbtn" type="button" onClick={() => toast(r + ' generated')}>Generate</button></div>)}</div></div>
          <div className="card"><h2 style={{ fontSize: 17 }}>Daily reconciliation</h2><div className="stack" style={{ gap: 8, marginTop: 12 }}>{[['Client cash vs Trust Bank client account', 'Matched'], ['CSCS holdings vs internal ledger', 'Matched'], ['Open orders vs broker blotter', '1 break (VND-26-004809 status)'], ['Lien register vs CSCS', 'Matched']].map(([n, r]) => <div className="rowline" key={n}><span>{n}</span><Pill kind={r === 'Matched' ? 'good' : 'warn'}>{r}</Pill></div>)}</div><div className="muted xs" style={{ marginTop: 10 }}>Breaks here become client losses and regulator findings. The desk clears them before the next open.</div></div>
        </div>
      </div>
    </>
  )
}
