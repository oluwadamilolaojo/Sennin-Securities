import React, { useState } from 'react'
import { TopBar } from '../../layouts/Shell.jsx'
import { useStore } from '../../store/store.jsx'
import { fmtTime } from '../../utils.js'

export default function Audit() {
  const { state, toast } = useStore()
  const [q, setQ] = useState('')
  const rows = state.audit.filter(a => !q || (a.actor + a.action + a.detail).toLowerCase().includes(q.toLowerCase()))
  return (
    <>
      <TopBar title="Audit log" plain search={<input className="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search actor, action or detail" aria-label="Search audit log" />}><button className="btn btn-o btn-s" type="button" onClick={() => toast('Audit log exported (CSV)')}>Export</button></TopBar>
      <div className="content">
        <div className="card tight"><div className="scroll"><table className="tbl"><thead><tr><th>When</th><th>Actor</th><th>Action</th><th>Detail</th></tr></thead><tbody>
          {rows.map((a, i) => <tr key={i}><td style={{ whiteSpace: 'nowrap' }}>{fmtTime(a.ts)}</td><td>{a.actor}</td><td><strong>{a.action}</strong></td><td className="muted">{a.detail}</td></tr>)}
        </tbody></table></div><div className="card-foot muted">Append-only. Nothing here can be edited or deleted, which is what the regulator and the bank expect.</div></div>
      </div>
    </>
  )
}
