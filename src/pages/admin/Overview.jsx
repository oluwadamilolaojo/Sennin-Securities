import React from 'react'
import { Link } from 'react-router-dom'
import { TopBar } from '../../layouts/Shell.jsx'
import { useStore, loanMetrics } from '../../store/store.jsx'
import { Stat, Pill } from '../../components/ui.jsx'
import { naira, fmtTime, pct } from '../../utils.js'

export default function Overview() {
  const { state } = useStore()
  const open = state.orders.filter(o => ['Received', 'Sent to broker', 'On exchange', 'Partly filled', 'Queued for open'].includes(o.status))
  const active = state.loans.filter(l => l.status === 'Active')
  const book = active.reduce((s, l) => s + l.outstanding, 0)
  const coll = active.reduce((s, l) => s + loanMetrics(l, state).collateral, 0)
  const calls = active.filter(l => loanMetrics(l, state).band !== 'healthy')
  const claimsOpen = state.claims.filter(c => c.status !== 'Paid')
  const claimsValue = claimsOpen.reduce((s, c) => s + c.amount, 0)
  const paidValue = state.claims.filter(c => c.status === 'Paid').reduce((s, c) => s + c.amount, 0)
  return (
    <>
      <TopBar title="Operations overview" plain><span className="muted small">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</span></TopBar>
      <div className="content">
        {state.settings.marketShock > 0 && <div className="alert bad">Market shock simulation is on: prices are {Math.round(state.settings.marketShock * 100)}% below base. Turn it off in Fees, rates and flags.</div>}
        <div className="grid g4">
          <Stat label="Customers" value={state.adminUsers.length} sub={`${state.adminUsers.filter(u => u.kyc === 'Verified').length} verified · ${state.adminUsers.filter(u => u.kyc !== 'Verified').length} in KYC queue`} />
          <Stat label="Orders waiting on the desk" value={open.length} sub={`${open.filter(o => o.status === 'Received').length} not yet sent to broker`} />
          <Stat label="Recovery claims open" value={claimsOpen.length} sub={`${naira(claimsValue)} in flight · ${naira(paidValue)} paid`} />
          <Stat label="Loan book outstanding" value={naira(book)} sub={`${active.length} loans · weighted LTV ${coll ? pct(book / coll * 100) : '0%'}`} ink />
        </div>
        <div className="grid g3" style={{ alignItems: 'start' }}>
          <div className="card"><div className="row"><h2 style={{ fontSize: 17 }}>Needs a human now</h2></div><div className="stack" style={{ gap: 8, marginTop: 12 }}>
            {calls.map(l => <Link className="rowline" key={l.id} to="/admin/lending"><span><strong>{l.id}</strong> {l.ownerName}<div className="muted xs">LTV {pct(loanMetrics(l, state).ltv * 100)}</div></span><Pill kind="bad">Margin call</Pill></Link>)}
            {state.loans.filter(l => l.status === 'Pending approval').map(l => <Link className="rowline" key={l.id} to="/admin/lending"><span><strong>{l.id}</strong> {l.ownerName}<div className="muted xs">{naira(l.amount)} for {l.tenor} months</div></span><Pill kind="warn">Approve or decline</Pill></Link>)}
            {state.orders.filter(o => o.status === 'Received').map(o => <Link className="rowline" key={o.id} to="/admin/orders"><span><strong>{o.ticker}</strong> {o.side} {o.units.toLocaleString()} · {o.ownerName || state.user.name}<div className="muted xs">{o.id}</div></span><Pill kind="info">Send to broker</Pill></Link>)}
            {state.adminUsers.filter(u => u.kyc !== 'Verified').map(u => <Link className="rowline" key={u.id} to="/admin/users"><span><strong>{u.name}</strong><div className="muted xs">{u.kyc}</div></span><Pill kind="warn">KYC</Pill></Link>)}
            {state.amlFlags.filter(f => f.status === 'Open').map(f => <Link className="rowline" key={f.id} to="/admin/compliance"><span><strong>{f.user}</strong><div className="muted xs">{f.type}</div></span><Pill kind="bad">{f.risk} risk</Pill></Link>)}
          </div></div>
          <div className="card"><h2 style={{ fontSize: 17 }}>Service health</h2><div className="stack" style={{ gap: 8, marginTop: 12 }}>
            {[['Trading', state.settings.flags.trading], ['Lending', state.settings.flags.lending], ['Recovery', state.settings.flags.recovery], ['Broker API (Trust Bank Securities)', false], ['CSCS lien API', false], ['NIBSS direct debit', true], ['BVN / NIN verification', true]].map(([n, ok]) => <div className="rowline" key={n}><span>{n}</span><span className={ok ? 'up' : 'muted'} style={{ fontWeight: 600 }}>{ok ? 'Live' : n.includes('API') ? 'Manual (Phase 2 automates)' : 'Paused'}</span></div>)}
          </div></div>
          <div className="card"><h2 style={{ fontSize: 17 }}>Latest actions</h2><div className="stack" style={{ gap: 8, marginTop: 12, fontSize: 13 }}>{state.audit.slice(0, 8).map((a, i) => <div className="rowline" key={i}><span><strong>{a.action}</strong><div className="muted xs">{a.actor} · {a.detail}</div></span><span className="muted xs" style={{ whiteSpace: 'nowrap' }}>{fmtTime(a.ts)}</span></div>)}</div><Link to="/admin/audit" className="small" style={{ display: 'inline-block', marginTop: 10 }}>Full audit log</Link></div>
        </div>
      </div>
    </>
  )
}
