import React from 'react'
import { TopBar } from '../../layouts/Shell.jsx'
import { useStore } from '../../store/store.jsx'
import { Pill } from '../../components/ui.jsx'
import { fmtTime, naira } from '../../utils.js'

export default function Documents() {
  const { state, toast } = useStore()
  const loans = state.loans.filter(l => l.owner === 'u-1')
  return (
    <>
      <TopBar title="Documents and statements" plain />
      <div className="content">
        <div className="grid g2" style={{ alignItems: 'start' }}>
          <div className="card"><h2 style={{ fontSize: 17 }}>Documents</h2><div className="stack" style={{ gap: 8, marginTop: 12 }}>
            {loans.map(l => ['Loan agreement', 'Key facts sheet', 'NIBSS direct debit mandate', 'CSCS lien confirmation', 'Monthly loan statement'].map(d => <div className="rowline" key={l.id + d}><span>{d}<div className="muted xs">{l.id} · {naira(l.amount)}</div></span><button className="linkbtn" type="button" onClick={() => toast(d + ' downloading')}>Download</button></div>))}
            {!loans.length && <div className="muted small">No loan documents yet.</div>}
          </div></div>
          <div className="card"><h2 style={{ fontSize: 17 }}>Every message and action, logged</h2><p className="muted xs" style={{ marginTop: 4 }}>Kept for the life of the loan and shared with Trust Bank.</p><div className="stack" style={{ gap: 8, marginTop: 12 }}>
            {loans.flatMap(l => l.alerts.map((a, i) => <div className="rowline" key={l.id + i} style={{ fontSize: 13 }}><span><strong>{a[1]}</strong><div className="muted">{a[2]}</div></span><span className="muted xs" style={{ whiteSpace: 'nowrap' }}>{fmtTime(a[0])}</span></div>))}
            {!loans.length && <div className="muted small">Nothing yet.</div>}
          </div></div>
        </div>
      </div>
    </>
  )
}
