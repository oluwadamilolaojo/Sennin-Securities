import React, { useState } from 'react'
import { TopBar } from '../../layouts/Shell.jsx'
import { useStore } from '../../store/store.jsx'
import { Pill, statusPill, Modal } from '../../components/ui.jsx'
import { naira, fmtDate } from '../../utils.js'

export default function Users() {
  const { state, dispatch, toast } = useStore()
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(null)
  const rows = state.adminUsers.filter(u => !q || u.name.toLowerCase().includes(q.toLowerCase()) || u.email.includes(q.toLowerCase()) || (u.chn || '').includes(q))
  const queue = rows.filter(u => u.kyc !== 'Verified'), ok = rows.filter(u => u.kyc === 'Verified')
  return (
    <>
      <TopBar title="Customers and KYC" plain search={<input className="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, email or CHN" aria-label="Search customers" />} />
      <div className="content">
        <div className="card tight"><div className="card-head"><h2>KYC queue ({queue.length})</h2><span className="muted small">BVN, NIN and selfie checks run automatically; these need a person</span></div>
          <div className="scroll"><table className="tbl"><thead><tr><th>Customer</th><th>Joined</th><th>Tier</th><th>Status</th><th></th></tr></thead><tbody>
            {queue.map(u => <tr key={u.id}><td><strong>{u.name}</strong><div className="muted xs">{u.email}</div></td><td>{fmtDate(u.joined)}</td><td>Tier {u.tier}</td><td>{statusPill(u.kyc)}</td><td style={{ whiteSpace: 'nowrap' }}><button className="btn btn-p btn-s" type="button" onClick={() => { dispatch({ type: 'KYC', id: u.id, status: 'Verified' }); toast(u.name + ' verified. CHN opening requested.') }}>Approve</button> <button className="btn btn-o btn-s" type="button" onClick={() => setSel(u)}>Review</button> <button className="linkbtn" type="button" onClick={() => { dispatch({ type: 'KYC', id: u.id, status: 'Rejected' }); toast('Rejected; customer notified') }}>Reject</button></td></tr>)}
            {!queue.length && <tr><td colSpan="5" className="muted" style={{ textAlign: 'center', padding: 24 }}>Nothing waiting.</td></tr>}
          </tbody></table></div></div>
        <div className="card tight"><div className="card-head"><h2>All customers</h2><span className="muted small">{state.adminUsers.length} total</span></div>
          <div className="scroll"><table className="tbl"><thead><tr><th>Customer</th><th>CHN</th><th>Tier</th><th>KYC</th><th className="num">Holdings</th><th>Joined</th><th></th></tr></thead><tbody>
            {ok.map(u => <tr key={u.id}><td><strong>{u.name}</strong><div className="muted xs">{u.email}</div></td><td>{u.chn === 'pending' ? <Pill kind="warn">CHN pending</Pill> : u.chn || <span className="muted">none</span>}</td><td>Tier {u.tier}</td><td>{statusPill(u.kyc)}</td><td className="num">{naira(u.holdings)}</td><td>{fmtDate(u.joined)}</td><td><button className="linkbtn" type="button" onClick={() => setSel(u)}>Open</button></td></tr>)}
          </tbody></table></div></div>
      </div>
      {sel && <Modal title={sel.name} onClose={() => setSel(null)}>
        <div className="stack" style={{ gap: 8 }}>
          <div className="rowline"><span>Email</span><strong>{sel.email}</strong></div>
          <div className="rowline"><span>KYC</span>{statusPill(sel.kyc)}</div>
          <div className="rowline"><span>BVN check</span><Pill kind="good">Match</Pill></div>
          <div className="rowline"><span>NIN check</span><Pill kind={sel.kyc === 'Selfie mismatch' ? 'bad' : 'good'}>{sel.kyc === 'Selfie mismatch' ? 'Selfie 61% match' : 'Match'}</Pill></div>
          <div className="rowline"><span>Sanctions and PEP screen</span><Pill kind={sel.name === 'Ibrahim Musa' ? 'warn' : 'good'}>{sel.name === 'Ibrahim Musa' ? 'Possible PEP match' : 'Clear'}</Pill></div>
          <div className="rowline"><span>CHN</span><strong>{sel.chn || 'Not yet opened'}</strong></div>
          <div className="rowline"><span>Holdings</span><strong>{naira(sel.holdings)}</strong></div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>{sel.kyc !== 'Verified' && <button className="btn btn-p" type="button" onClick={() => { dispatch({ type: 'KYC', id: sel.id, status: 'Verified' }); toast('Verified'); setSel(null) }}>Approve</button>}<button className="btn btn-o" type="button" onClick={() => { toast('Message sent asking for a new selfie'); setSel(null) }}>Ask for new selfie</button><button className="btn btn-o" type="button" onClick={() => toast('Account frozen pending review')}>Freeze account</button></div>
      </Modal>}
    </>
  )
}
