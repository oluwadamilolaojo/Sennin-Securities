import React, { useState } from 'react'
import { TopBar } from '../../layouts/Shell.jsx'
import { useStore } from '../../store/store.jsx'
import { Pill, statusPill, Tabs } from '../../components/ui.jsx'
import { naira, n0, n2, fmtTime } from '../../utils.js'

const OPEN = ['Received', 'Sent to broker', 'On exchange', 'Partly filled', 'Queued for open']
const NEXT = { 'Received': 'Send to broker', 'Queued for open': 'Send to broker', 'Sent to broker': 'Mark on exchange', 'On exchange': 'Mark filled', 'Partly filled': 'Mark filled', 'Filled': 'Mark settled' }

export default function OrderDesk() {
  const { state, dispatch, toast } = useStore()
  const [tab, setTab] = useState('queue')
  const rows = state.orders.filter(o => tab === 'queue' ? OPEN.includes(o.status) || o.status === 'Filled' : !OPEN.includes(o.status) && o.status !== 'Filled')
  return (
    <>
      <TopBar title="Order desk" plain><span className="muted small">Manual routing to Trust Bank Securities until the API goes live (Phase 2)</span></TopBar>
      <div className="content">
        <div className="alert info">Workflow: <strong>Received</strong> → send to broker (email or portal) → <strong>On exchange</strong> → broker confirms fill → <strong>Filled</strong> → settlement confirmed by CSCS → <strong>Settled</strong>. Settling a buy moves cash and units on the customer's account.</div>
        <div className="card tight">
          <Tabs tabs={[{ value: 'queue', label: `Working (${state.orders.filter(o => OPEN.includes(o.status) || o.status === 'Filled').length})` }, { value: 'done', label: 'Completed and cancelled' }]} value={tab} onChange={setTab} />
          <div className="scroll"><table className="tbl"><thead><tr><th>Placed</th><th>Customer</th><th>Order</th><th>Security</th><th className="num">Units</th><th className="num">Price</th><th className="num">Est. value</th><th>Status</th><th></th></tr></thead><tbody>
            {rows.map(o => <tr key={o.id}><td>{fmtTime(o.ts)}<div className="muted xs">{o.id}</div></td><td>{o.ownerName || state.user.name}</td><td><Pill kind={o.side === 'Buy' ? 'info' : 'bad'}>{o.side}</Pill> <span className="muted xs">{o.validity}</span></td><td><strong>{o.ticker}</strong></td><td className="num">{n0(o.units)}{o.filled && o.filled < o.units ? <div className="muted xs">{n0(o.filled)} filled</div> : null}</td><td className="num">{o.limit ? `Limit ₦${n2(o.limit)}` : 'Market'}</td><td className="num">{naira(o.units * (o.limit || 0) || 0) === '₦0' ? <span className="muted">market</span> : naira(o.units * o.limit)}</td><td>{statusPill(o.status)}</td><td style={{ whiteSpace: 'nowrap' }}>{NEXT[o.status] && <button className="btn btn-p btn-s" type="button" onClick={() => { dispatch({ type: 'ADVANCE_ORDER', id: o.id }); toast(NEXT[o.status] + ' done') }}>{NEXT[o.status]}</button>} {OPEN.includes(o.status) && <button className="linkbtn" type="button" onClick={() => { dispatch({ type: 'CANCEL_ORDER', id: o.id }); toast('Order cancelled') }}>Cancel</button>}</td></tr>)}
            {!rows.length && <tr><td colSpan="9" className="muted" style={{ textAlign: 'center', padding: 30 }}>Queue is empty.</td></tr>}
          </tbody></table></div>
          <div className="card-foot muted">Every click is logged with your name. Customers see the new status in their order tracker within seconds.</div>
        </div>
      </div>
    </>
  )
}
