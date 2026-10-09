import React, { useState } from 'react'
import { useStore } from '../../store/store.jsx'
import { today } from '../../utils.js'

export default function Waitlist() {
  const { dispatch } = useStore()
  const [f, setF] = useState({ name: '', phone: '', invest: true, borrow: false })
  const [ok, setOk] = useState(false)
  return (
    <section className="block alt" id="waitlist">
      <div className="wrap wl">
        <div className="sechead"><h2>Be first in when investing and borrowing open</h2><p>Recovery is open today. Investing opens in November 2026, borrowing in March 2027. [Early-member offer to be confirmed.]</p></div>
        <form className="wlform" onSubmit={e => { e.preventDefault(); dispatch({ type: 'WAITLIST', entry: { ...f, ts: today() } }); setOk(true) }}>
          <div><label className="lbl" htmlFor="wlname" style={{ fontSize: 15, color: 'var(--text)', fontWeight: 600 }}>Your name</label><input id="wlname" className="inp" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} autoComplete="name" /></div>
          <div><label className="lbl" htmlFor="wlphone" style={{ fontSize: 15, color: 'var(--text)', fontWeight: 600 }}>Phone number (WhatsApp)</label><input id="wlphone" className="inp" type="tel" value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} placeholder="0803 000 0000" /></div>
          <fieldset style={{ border: 0, padding: 0, margin: 0 }}><legend style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>I'm interested in</legend><div className="checks"><label><input type="checkbox" checked={f.invest} onChange={e => setF({ ...f, invest: e.target.checked })} /> Investing</label><label><input type="checkbox" checked={f.borrow} onChange={e => setF({ ...f, borrow: e.target.checked })} /> Borrowing</label></div></fieldset>
          <button className="btn btn-p btn-l" type="submit">Join the waitlist</button>
          {ok && <p className="alert good" role="status">You're on the list. We'll message you on WhatsApp when it opens.</p>}
          <p className="muted small">We'll only contact you about Vendii. Unsubscribe any time.</p>
        </form>
      </div>
    </section>
  )
}
