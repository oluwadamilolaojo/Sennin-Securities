import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { TopBar } from '../../layouts/Shell.jsx'
import { useStore } from '../../store/store.jsx'
import { Pill, OrderSteps, Tabs, statusPill, Modal } from '../../components/ui.jsx'
import { naira, n2, n0, fmtTime, fmtDate } from '../../utils.js'

const OPEN = ['Received', 'Sent to broker', 'On exchange', 'Partly filled', 'Queued for open']

export default function Orders() {
  const { state, dispatch, toast } = useStore()
  const [sp] = useSearchParams()
  const [tab, setTab] = useState(sp.get('tab') || 'open')
  const [sel, setSel] = useState(null)
  const [amend, setAmend] = useState(null)
  const mine = state.orders.filter(o => o.owner === 'u-1')
  const open = mine.filter(o => OPEN.includes(o.status))
  const hist = mine.filter(o => !OPEN.includes(o.status))
  const focus = sel ? mine.find(o => o.id === sel) : open[0]
  return (
    <>
      <TopBar title="Orders and activity"><Link className="btn btn-p btn-s" to="/app/markets">New order</Link></TopBar>
      <div className="content">
        {focus && (
          <div className="card" style={{ borderColor: 'var(--blue)' }}>
            <div className="row" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Pill kind={focus.side === 'Buy' ? 'info' : 'bad'}>{focus.side}</Pill><h2 style={{ fontSize: 20 }}>{focus.ticker} · {n0(focus.units)} units · {focus.type}{focus.limit ? ` ₦${n2(focus.limit)}` : ''}</h2></div>
                <div className="muted small" style={{ marginTop: 4 }}>Order {focus.id} · placed {fmtTime(focus.ts)} · valid {focus.validity === 'Day' ? 'today' : 'until cancelled'}</div>
              </div>
              {OPEN.includes(focus.status) && <div style={{ display: 'flex', gap: 10 }}><button className="btn btn-o btn-s" type="button" onClick={() => setAmend(focus)}>Amend price</button><button className="btn btn-d btn-s" type="button" onClick={() => { dispatch({ type: 'CANCEL_ORDER', id: focus.id }); toast('Order cancelled'); setSel(null) }}>Cancel remaining</button></div>}
            </div>
            <OrderSteps order={focus} />
            <div className="rowline" style={{ marginTop: 24 }}>
              <span>{focus.status === 'Partly filled' ? `${n0(focus.units - focus.filled)} units still open. The rest fills when a seller matches ₦${n2(focus.limit)} or better, or the order expires at the close.` : focus.status === 'Queued for open' ? 'Placed after the close. It goes to the exchange at 10:00 tomorrow.' : focus.status === 'Received' ? 'Our order desk sends this to Trust Bank Securities within minutes during market hours.' : focus.status === 'Settled' ? 'Shares and cash have moved. The contract note is in your statements.' : `Status: ${focus.status}.`}</span>
              <Link to="/app/support" className="small" style={{ marginLeft: 'auto' }}>Why do orders fill in parts?</Link>
            </div>
          </div>
        )}
        <div className="card tight">
          <Tabs tabs={[{ value: 'open', label: `Open orders (${open.length})` }, { value: 'history', label: 'Trade history' }, { value: 'statements', label: 'Statements' }]} value={tab} onChange={setTab} />
          {tab !== 'statements' && (
            <div className="scroll"><table className="tbl">
              <thead><tr><th>Placed</th><th>Order</th><th>Security</th><th className="num">Units</th><th className="num">Price</th><th>Status</th><th className="num">Total</th><th></th></tr></thead>
              <tbody>
                {(tab === 'open' ? open : hist).map(o => (
                  <tr key={o.id} className="click" onClick={() => setSel(o.id)}>
                    <td>{fmtTime(o.ts)}</td><td><Pill kind={o.side === 'Buy' ? 'info' : 'bad'}>{o.side}</Pill></td><td><strong>{o.ticker}</strong><div className="muted xs">{o.id}</div></td>
                    <td className="num">{n0(o.units)}{o.filled && o.filled < o.units ? <div className="muted xs">{n0(o.filled)} filled</div> : null}</td>
                    <td className="num">{o.limit ? `Limit ₦${n2(o.limit)}` : 'Market'}</td><td>{statusPill(o.status)}</td>
                    <td className="num">{o.total ? naira(o.total) : <span className="muted">pending</span>}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{OPEN.includes(o.status) ? <button className="linkbtn" type="button" onClick={e => { e.stopPropagation(); dispatch({ type: 'CANCEL_ORDER', id: o.id }); toast('Order cancelled') }}>Cancel</button> : o.status === 'Settled' ? <button className="linkbtn" type="button" onClick={e => { e.stopPropagation(); toast('Contract note ' + o.id + '.pdf downloading') }}>Contract note</button> : null}</td>
                  </tr>
                ))}
                {!(tab === 'open' ? open : hist).length && <tr><td colSpan="8" className="muted" style={{ textAlign: 'center', padding: 30 }}>Nothing here yet.</td></tr>}
              </tbody>
            </table></div>
          )}
          {tab === 'statements' && (
            <div style={{ padding: 20 }} className="grid g2">
              <div className="stack" style={{ gap: 10 }}>
                <h3 style={{ fontSize: 16 }}>Statements and documents</h3>
                {[['Monthly statement, September 2026', 'Download'], ['Monthly statement, August 2026', 'Download'], ['CSCS holdings statement (as of today)', 'Request'], ['All contract notes, 2026 (zip)', 'Download']].map(([n, a]) => <div className="rowline" key={n}><span>{n}</span><button className="linkbtn" type="button" onClick={() => toast(a === 'Request' ? 'CSCS statement requested. It lands in your email within 1 working day.' : n + ' downloading')}>{a}</button></div>)}
                <div className="rowline"><span>Annual tax pack 2026 (dividends, WHT, disposals)</span><Pill>Phase 3</Pill></div>
                <div className="rowline"><span>Export transactions (CSV)</span><Pill>Phase 3</Pill></div>
              </div>
              <div className="card" style={{ background: 'var(--paper)' }}>
                <h3 style={{ fontSize: 16 }}>Something wrong with a trade?</h3>
                <p className="muted small" style={{ marginTop: 8 }}>Log a complaint and we acknowledge within 1 working day. You can track every step, and escalate to the SEC if we don't resolve it.</p>
                <Link to="/app/support?tab=complaints" className="btn btn-o btn-s" style={{ marginTop: 12 }}>Log a complaint</Link>
              </div>
            </div>
          )}
        </div>
      </div>
      {amend && <Modal title="Amend limit price" onClose={() => setAmend(null)}><p className="muted small">Amending cancels the open part of the order and sends a new one at the price you choose.</p><input className="inp" type="number" step="0.05" defaultValue={amend.limit || ''} style={{ marginTop: 12 }} aria-label="New limit price" /><div style={{ display: 'flex', gap: 10, marginTop: 16 }}><button className="btn btn-o" type="button" onClick={() => setAmend(null)}>Back</button><button className="btn btn-p" type="button" onClick={() => { toast('Amendment sent to the desk'); setAmend(null) }}>Send amendment</button></div></Modal>}
    </>
  )
}
