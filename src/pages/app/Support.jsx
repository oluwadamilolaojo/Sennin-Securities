import React, { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { TopBar } from '../../layouts/Shell.jsx'
import { useStore } from '../../store/store.jsx'
import { Tabs, statusPill, Field } from '../../components/ui.jsx'
import { fmtDate, today, uid, addMonths } from '../../utils.js'

const FAQ = [
  ['Why do orders fill in parts?', 'The exchange matches your order against whatever sellers are available at your price. On a thin stock that can be a few hundred units at a time. The rest stays open until it fills, you cancel, or the order expires.'],
  ['When can I withdraw money from a sale?', 'Sale proceeds settle a few days after the trade, following the exchange\'s settlement cycle. Settled cash shows on your home screen and can be withdrawn at once.'],
  ['Why is my dividend smaller than expected?', 'Companies pay dividends after deducting 10% withholding tax. We show the net amount on every screen so it matches the bank credit.'],
  ['How do I claim a late relative\'s shares?', 'Use the family check on the website or ask us in chat. You will need the death certificate and letters of administration or probate.'],
]

export default function Support() {
  const { state, dispatch, toast } = useStore()
  const [sp] = useSearchParams()
  const [tab, setTab] = useState(sp.get('tab') || 'help')
  const [form, setForm] = useState({ subject: '', detail: '' })
  const [msgs, setMsgs] = useState([{ who: 'Vendii', text: 'Hi Damilola, how can we help today?' }])
  const [draft, setDraft] = useState('')
  const mine = state.complaints.filter(c => c.user === state.user.name)
  function send() {
    if (!draft.trim()) return
    const m = [...msgs, { who: 'You', text: draft }]
    setMsgs(m); setDraft('')
    setTimeout(() => setMsgs(x => [...x, { who: 'Vendii', text: 'Thanks. A person will pick this up within 15 minutes on working days. If it is about a trade, the order ID helps.' }]), 600)
  }
  return (
    <>
      <TopBar title="Help and complaints"><span className="muted small">Real people on chat, WhatsApp and phone, [hours]</span></TopBar>
      <div className="content">
        <div className="card tight">
          <Tabs tabs={[{ value: 'help', label: 'Help centre' }, { value: 'chat', label: 'Chat with us' }, { value: 'complaints', label: `Complaints (${mine.length})` }, { value: 'status', label: 'Service status' }]} value={tab} onChange={setTab} />
          <div style={{ padding: 20 }}>
            {tab === 'help' && <div className="faq" style={{ marginTop: 0 }}>{FAQ.map(([q, a]) => <details key={q}><summary style={{ fontSize: 16 }}>{q}</summary><p style={{ fontSize: 15 }}>{a}</p></details>)}<p className="muted small" style={{ marginTop: 16 }}>Official channels only: in-app chat, WhatsApp [number], phone [number], [support email]. Anyone else claiming to be Vendii is not.</p></div>}
            {tab === 'chat' && (
              <div style={{ maxWidth: 640 }}>
                <div className="stack" style={{ gap: 8, minHeight: 200 }}>{msgs.map((m, i) => <div key={i} className="rowline" style={{ justifyContent: m.who === 'You' ? 'flex-end' : 'flex-start', background: m.who === 'You' ? '#D6E4F0' : 'var(--paper)' }}><span><div className="muted xs">{m.who}</div>{m.text}</span></div>)}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}><input className="inp" value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Type a message" aria-label="Message" /><button className="btn btn-p" type="button" onClick={send}>Send</button></div>
                <div className="muted xs" style={{ marginTop: 8 }}>Prefer WhatsApp? Message [number] from the phone on your account.</div>
              </div>
            )}
            {tab === 'complaints' && (
              <div className="grid g2">
                <div className="stack" style={{ gap: 12 }}>
                  <h3 style={{ fontSize: 16 }}>Log a complaint</h3>
                  <p className="muted small">We acknowledge within 1 working day and resolve within the SEC timelines. If you are not satisfied, you can escalate to the SEC with the reference we give you.</p>
                  <Field label="Subject" id="cs"><input id="cs" className="inp" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Order filled at a worse price" /></Field>
                  <Field label="What happened" id="cd"><textarea id="cd" className="inp" value={form.detail} onChange={e => setForm({ ...form, detail: e.target.value })} /></Field>
                  <button className="btn btn-p" type="button" onClick={() => { if (!form.subject) { toast('Add a subject', 'bad'); return } const c = { id: uid('CMP'), user: state.user.name, subject: form.subject, opened: today(), due: addMonths(today(), 0).slice(0, 10), status: 'Open', channel: 'In-app' }; dispatch({ type: 'COMPLAINT', complaint: c }); setForm({ subject: '', detail: '' }); toast('Complaint logged: ' + c.id, 'good') }}>Submit complaint</button>
                </div>
                <div className="stack" style={{ gap: 8 }}>
                  <h3 style={{ fontSize: 16 }}>Your complaints</h3>
                  {mine.map(c => <div className="rowline" key={c.id}><span><strong>{c.subject}</strong><div className="muted xs">{c.id} · opened {fmtDate(c.opened)}</div></span>{statusPill(c.status)}</div>)}
                  {!mine.length && <div className="muted small">None logged.</div>}
                </div>
              </div>
            )}
            {tab === 'status' && (
              <div className="stack" style={{ gap: 8, maxWidth: 640 }}>
                {[['Trading and order routing', state.settings.flags.trading ? 'Operating normally' : 'Paused'], ['Deposits via bank transfer', 'Operating normally'], ['Withdrawals', 'Average 38 minutes today'], ['Recovery claims', 'Operating normally'], ['Share-backed loans', state.settings.flags.lending ? 'Operating normally' : 'Paused'], ['Market data', state.settings.flags.realtimePrices ? 'Live' : 'Delayed 15 minutes']].map(([n, s]) => <div className="rowline" key={n}><span>{n}</span><span className={s.includes('Paused') ? 'dn' : 'up'} style={{ fontWeight: 600 }}>{s}</span></div>)}
                <p className="muted xs">This page is public at vendii.ng/status so you never have to ask whether something is down.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
