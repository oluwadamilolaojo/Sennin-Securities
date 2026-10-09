import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { TopBar } from '../../layouts/Shell.jsx'
import { useStore } from '../../store/store.jsx'
import { Pill, Tabs, Switch, Field } from '../../components/ui.jsx'
import { fmtDate, today } from '../../utils.js'

export default function Settings() {
  const { state, dispatch, toast } = useStore()
  const [sp] = useSearchParams()
  const [tab, setTab] = useState(sp.get('tab') || 'profile')
  const u = state.user
  const [ben, setBen] = useState(u.beneficiary)
  const [bank, setBank] = useState({ ...u.bank, number: '' })
  return (
    <>
      <TopBar title="Settings and security" />
      <div className="content">
        <div className="card tight">
          <Tabs tabs={[{ value: 'profile', label: 'Profile and KYC' }, { value: 'beneficiary', label: 'Beneficiary' }, { value: 'bank', label: 'Bank account' }, { value: 'security', label: 'Security' }, { value: 'prefs', label: 'Notifications' }]} value={tab} onChange={setTab} />
          <div style={{ padding: 20 }}>
            {tab === 'profile' && (
              <div className="grid g2">
                <div className="stack" style={{ gap: 10 }}>
                  <div className="rowline"><span>Name</span><strong>{u.name}</strong></div>
                  <div className="rowline"><span>Email</span><strong>{u.email}</strong></div>
                  <div className="rowline"><span>Phone</span><strong>{u.phone}</strong></div>
                  <div className="rowline"><span>BVN</span><strong>••••••{u.bvnLast} <Pill kind="good">Matched</Pill></strong></div>
                  <div className="rowline"><span>NIN</span><strong>••••••{u.ninLast} <Pill kind="good">Matched</Pill></strong></div>
                  <div className="rowline"><span>CSCS number (CHN)</span><strong>{u.chn}</strong></div>
                  <div className="rowline"><span>Investor profile</span><strong>{u.risk} · {u.experience} experience</strong></div>
                </div>
                <div className="card" style={{ background: 'var(--paper)' }}>
                  <h3 style={{ fontSize: 16 }}>Account tier {u.tier} <Pill kind="good">{u.kyc}</Pill></h3>
                  <p className="muted small" style={{ marginTop: 6 }}>Tier 2 lets you invest up to ₦5m a month. Add proof of address to remove the limit.</p>
                  <button className="btn btn-o btn-s" type="button" style={{ marginTop: 12 }} onClick={() => toast('Upload a utility bill or bank statement from the last 3 months')}>Upgrade to tier 3</button>
                  <p className="muted xs" style={{ marginTop: 14 }}>Member since {fmtDate(u.joined)}. Sample limits; final tiers follow CBN and SEC guidance.</p>
                </div>
              </div>
            )}
            {tab === 'beneficiary' && (
              <div className="grid g2">
                <div className="stack" style={{ gap: 14 }}>
                  <div className="alert warn">About ₦270bn of Nigerian dividends sit unclaimed, much of it because a shareholder died and nobody knew the shares existed. Keep this current.</div>
                  <Field label="Full name" id="bn"><input id="bn" className="inp" value={ben.name} onChange={e => setBen({ ...ben, name: e.target.value })} /></Field>
                  <Field label="Relationship" id="br"><select id="br" className="inp" value={ben.relationship} onChange={e => setBen({ ...ben, relationship: e.target.value })}>{['Spouse', 'Child', 'Parent', 'Sibling', 'Other'].map(r => <option key={r}>{r}</option>)}</select></Field>
                  <Field label="Phone" id="bp"><input id="bp" className="inp" value={ben.phone} onChange={e => setBen({ ...ben, phone: e.target.value })} /></Field>
                  <button className="btn btn-p" type="button" onClick={() => { dispatch({ type: 'UPDATE_USER', patch: { beneficiary: { ...ben, confirmed: today() } } }); toast('Beneficiary saved', 'good') }}>Save</button>
                </div>
                <div className="card" style={{ background: 'var(--paper)' }}><h3 style={{ fontSize: 16 }}>Current beneficiary</h3><p style={{ marginTop: 6 }}><strong>{u.beneficiary.name}</strong> ({u.beneficiary.relationship})</p><p className="muted small">Last confirmed {fmtDate(u.beneficiary.confirmed)}. We remind you every year.</p></div>
              </div>
            )}
            {tab === 'bank' && (
              <div className="grid g2">
                <div className="stack" style={{ gap: 14 }}>
                  <div className="rowline"><span>Current payout account</span><strong>{u.bank.name} ••{u.bank.last4} · {u.bank.accountName}</strong></div>
                  <Field label="Bank" id="bk"><select id="bk" className="inp" value={bank.name} onChange={e => setBank({ ...bank, name: e.target.value })}>{['GTBank', 'Zenith Bank', 'Access Bank', 'UBA', 'First Bank', 'Trust Bank'].map(b => <option key={b}>{b}</option>)}</select></Field>
                  <Field label="Account number" id="an" hint="The name on the account must match your BVN. The change takes effect after 24 hours."><input id="an" className="inp" value={bank.number} onChange={e => setBank({ ...bank, number: e.target.value })} placeholder="10 digits" /></Field>
                  <button className="btn btn-p" type="button" onClick={() => { if (bank.number.length !== 10) { toast('Enter a 10-digit account number', 'bad'); return } dispatch({ type: 'UPDATE_USER', patch: { bank: { name: bank.name, last4: bank.number.slice(-4), accountName: u.bank.accountName } } }); toast('Payout account updated. Active after 24 hours.', 'good') }}>Change payout account</button>
                </div>
                <div className="card" style={{ background: 'var(--paper)' }}><h3 style={{ fontSize: 16 }}>Why only one account</h3><p className="muted small" style={{ marginTop: 6 }}>Withdrawals and recovered dividends go only to an account in your own name. It's the single most effective fraud control we have.</p></div>
              </div>
            )}
            {tab === 'security' && (
              <div className="grid g2">
                <div className="stack" style={{ gap: 8 }}>
                  <div className="rowline"><span>Fingerprint or face to open</span><Switch on={u.security.biometric} onChange={() => dispatch({ type: 'SET_SECURITY', patch: { biometric: !u.security.biometric } })} label="Biometric" /></div>
                  <div className="rowline"><span>Transaction PIN</span><button className="linkbtn" type="button" onClick={() => toast('A code was sent to your phone')}>Change PIN</button></div>
                  <div className="rowline"><span>Two-factor codes for withdrawals and bank changes</span><Pill kind="good">Always on</Pill></div>
                  <div className="rowline"><span>Block screenshots on sensitive screens</span><Switch on={u.security.screenshots} onChange={() => dispatch({ type: 'SET_SECURITY', patch: { screenshots: !u.security.screenshots } })} label="Screenshots" /></div>
                  <div className="rowline"><span>Log out after 10 minutes idle</span><Switch on={u.security.timeout} onChange={() => dispatch({ type: 'SET_SECURITY', patch: { timeout: !u.security.timeout } })} label="Timeout" /></div>
                </div>
                <div className="stack" style={{ gap: 8 }}>
                  <h3 style={{ fontSize: 16 }}>Trusted devices</h3>
                  {u.security.devices.map(d => <div className="rowline" key={d}><span>{d}</span><button className="linkbtn" type="button" onClick={() => { dispatch({ type: 'SET_SECURITY', patch: { devices: u.security.devices.filter(x => x !== d) } }); toast('Device removed') }}>Remove</button></div>)}
                  <div className="muted xs">A new device needs a fresh BVN selfie before it can trade or withdraw.</div>
                </div>
              </div>
            )}
            {tab === 'prefs' && (
              <div className="stack" style={{ gap: 8, maxWidth: 560 }}>
                {[['Order updates', 'push, SMS'], ['Dividends and coupons', 'push, email'], ['Recovery claim progress', 'WhatsApp, push'], ['Loan health warnings', 'SMS, WhatsApp, email, push (cannot be turned off)'], ['Daily market wrap', 'push'], ['Price alerts', 'push']].map(([n, ch]) => <div className="rowline" key={n}><span>{n}<div className="muted xs">{ch}</div></span><Switch on={true} onChange={() => toast('Saved')} label={n} /></div>)}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
