import React from 'react'
import { Link } from 'react-router-dom'

export default function Safety() {
  return (
    <>
      <div className="wrap page-hero"><h1>Where your money and shares actually sit.</h1><p>Investing has burned a lot of Nigerians. So here is exactly who holds what, how to check us, and what we promise.</p></div>
      <section className="block alt"><div className="wrap">
        <div className="safety" style={{ marginTop: 0 }}>
          {[['Shares in your own name at CSCS', 'Every share you buy is registered to your Clearing House Number at the Central Securities Clearing System. Vendii can\'t move them without your instruction.'], ['Cash kept apart from ours', 'Your cash sits in a client account with Trust Bank, our sponsoring broker\'s bank, separate from Vendii\'s operating money. Withdrawals go only to a bank account in your name.'], ['Licensed, and checkable', '[Vendii legal entity] is registered with the SEC Nigeria as a digital sub-broker, registration [number]. Search our name on the SEC register of capital market operators to confirm.'], ['Your data, protected', 'Registered with the Nigeria Data Protection Commission. BVN and NIN are used only to verify you and match registrar records.'], ['Official channels only', 'Our support lines are listed on this site and inside the app. If someone calls from another number claiming to be Vendii, hang up and report it below.'], ['Service status in public', 'If something is down or slow, the status page says so before you have to ask.']].map(([h, p]) => <div className="safe-item" key={h}><h3>{h}</h3><p>{p}</p></div>)}
        </div>
        <div className="promise" id="promise"><div><h3>The Vendii Promise</h3><p>If a mistake on our side costs you money, we put it right at our cost. If we're slow, we tell you why and when. Draft wording, pending legal review.</p></div><ul><li><strong>Real people</strong> on chat, WhatsApp and phone, [hours]</li><li><strong>Complaints</strong> acknowledged within 1 working day, with a tracked deadline you can see</li><li><strong>Withdrawals</strong> within [2] working hours, or we tell you the reason</li></ul></div>
      </div></section>
      <section className="block" id="status"><div className="wrap">
        <div className="grid g3">
          <div className="card"><h3 style={{ fontSize: 19 }}>Service status</h3><div className="stack" style={{ gap: 8, marginTop: 12 }}>{[['Trading', 'Operating normally'], ['Deposits', 'Operating normally'], ['Withdrawals', 'Average 38 minutes today'], ['Recovery claims', 'Operating normally'], ['Loans', 'Operating normally']].map(([n, v]) => <div className="rowline" key={n}><span>{n}</span><span className="up" style={{ fontWeight: 600 }}>{v}</span></div>)}</div></div>
          <div className="card" id="complaints"><h3 style={{ fontSize: 19 }}>Complaints</h3><p className="muted" style={{ marginTop: 8 }}>Log a complaint in the app or by email. We acknowledge within 1 working day and resolve within SEC timelines. If you're not satisfied, escalate to the SEC with the reference we give you.</p><Link className="btn btn-o" to="/app/support?tab=complaints" style={{ marginTop: 14 }}>Log a complaint</Link></div>
          <div className="card" id="fraud"><h3 style={{ fontSize: 19 }}>Report fraud</h3><p className="muted" style={{ marginTop: 8 }}>Got a call, SMS or WhatsApp claiming to be Vendii? Send it to [fraud email] or [WhatsApp number]. We never ask for your PIN, OTP or card details.</p><p className="muted small" style={{ marginTop: 14 }} id="legal">Legal: <a href="#terms">Terms</a> · <a href="#privacy">Privacy</a> · <a href="#risk">Risk disclosure</a> · <a href="#cookies">Cookies</a> · <a href="#complaints-policy">Complaints policy</a></p></div>
        </div>
      </div></section>
    </>
  )
}
