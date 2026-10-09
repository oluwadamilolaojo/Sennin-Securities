import React, { useState } from 'react'
import { TopBar } from '../../layouts/Shell.jsx'
import { useStore } from '../../store/store.jsx'
import { Pill, statusPill, Stat } from '../../components/ui.jsx'
import { naira, fmtDate } from '../../utils.js'
import { REGISTRARS } from '../../data/mock.js'

const NEXT = { 'Awaiting probate': 'Mark probate received', 'Submitted': 'Identity verified', 'Action needed': 'Document received', 'Identity check': 'Sent to registrar', 'With registrar': 'Registrar approved', 'Approved': 'Mark paid and collect fee' }

export default function Claims() {
  const { state, dispatch, toast } = useStore()
  const [reg, setReg] = useState('All')
  const open = state.claims.filter(c => c.status !== 'Paid')
  const rows = state.claims.filter(c => reg === 'All' || c.registrar === reg)
  const byReg = Object.entries(open.reduce((m, c) => { m[c.registrar] = (m[c.registrar] || 0) + c.amount; return m }, {})).sort((a, b) => b[1] - a[1])
  const fee = state.settings.recoveryFee
  return (
    <>
      <TopBar title="Recovery claims" plain><span className="muted small">One POA per customer; one checklist per registrar</span></TopBar>
      <div className="content">
        <div className="grid g4">
          <Stat label="Open claims" value={open.length} sub={naira(open.reduce((s, c) => s + c.amount, 0)) + ' in flight'} />
          <Stat label="Paid this quarter" value={naira(state.claims.filter(c => c.status === 'Paid').reduce((s, c) => s + c.amount, 0))} sub={`fees ${naira(state.claims.filter(c => c.status === 'Paid').reduce((s, c) => s + c.amount * fee, 0))}`} />
          <Stat label="Needing customer action" value={state.claims.filter(c => c.status === 'Action needed').length} sub="documents requested" />
          <Stat label="Average days to pay" value="31" sub="last 20 paid claims · sample" />
        </div>
        <div className="grid g3" style={{ alignItems: 'start' }}>
          <div className="card tight span2"><div className="card-head"><h2>Pipeline</h2><select className="inp" style={{ height: 38, width: 'auto' }} value={reg} onChange={e => setReg(e.target.value)} aria-label="Filter by registrar"><option>All</option>{REGISTRARS.map(r => <option key={r}>{r}</option>)}</select></div>
            <div className="scroll"><table className="tbl"><thead><tr><th>Claim</th><th>Customer</th><th>Company · registrar</th><th className="num">Amount</th><th>Status</th><th>Updated</th><th></th></tr></thead><tbody>
              {rows.map(c => <tr key={c.id}><td><strong>{c.id}</strong></td><td>{c.ownerName || state.user.name}</td><td>{c.company}<div className="muted xs">{c.registrar} · {c.years}</div></td><td className="num">{naira(c.amount)}<div className="muted xs">fee {naira(c.amount * fee)}</div></td><td>{statusPill(c.status)}<div className="muted xs">{c.note}</div></td><td>{fmtDate(c.updated)}</td><td style={{ whiteSpace: 'nowrap' }}>{NEXT[c.status] && <button className="btn btn-p btn-s" type="button" onClick={() => { dispatch({ type: 'ADVANCE_CLAIM', id: c.id }); toast(NEXT[c.status]) }}>{NEXT[c.status]}</button>}</td></tr>)}
            </tbody></table></div></div>
          <div className="stack">
            <div className="card"><h2 style={{ fontSize: 17 }}>Open value by registrar</h2><div className="stack" style={{ gap: 8, marginTop: 12 }}>{byReg.map(([r, v]) => <div className="rowline" key={r}><span>{r}</span><strong>{naira(v)}</strong></div>)}</div></div>
            <div className="card"><h2 style={{ fontSize: 17 }}>Registrar SLAs (sample)</h2><div className="stack" style={{ gap: 8, marginTop: 12, fontSize: 13 }}>{[['Meristem Registrars', '14 days', 'good'], ['Africa Prudential', '20 days', 'good'], ['Coronation Registrars', '28 days', 'warn'], ['First Registrars', '35 days', 'warn'], ['Cardinalstone Registrars', '21 days', 'good']].map(([r, d, k]) => <div className="rowline" key={r}><span>{r}</span><Pill kind={k}>{d}</Pill></div>)}</div></div>
          </div>
        </div>
      </div>
    </>
  )
}
