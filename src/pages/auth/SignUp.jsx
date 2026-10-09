import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useStore } from '../../store/store.jsx'
import { Logo, Pill } from '../../components/ui.jsx'
import { today } from '../../utils.js'

const LINES = ['We will start you with large, liquid companies and the FGN Savings Bond, and warn you before any thin stock.', 'You will see the full market with liquidity warnings on thin stocks. Limit orders are your default.', 'Full market, all order types. We still show liquidity and price band warnings, because everyone needs them.']

export default function SignUp() {
  const { state, dispatch, toast } = useStore()
  const nav = useNavigate()
  const [sp] = useSearchParams()
  const intent = sp.get('intent')
  const [step, setStep] = useState(1)
  const [exp, setExp] = useState(1)
  const [risk, setRisk] = useState(1)
  const [ben, setBen] = useState({ name: '', relationship: 'Spouse', phone: '' })
  const [bank, setBank] = useState({ name: 'GTBank', number: '' })
  const [agree, setAgree] = useState(false)
  const [chnMode, setChnMode] = useState('new')
  const steps = [['Prove it\'s you', 'BVN, NIN and a selfie. Done in 90 seconds.'], ['About your investing', 'Five questions so we only show you what fits.'], ['Who inherits your account', 'A name and a phone number. It matters more than you think.'], ['Your bank account', 'Where withdrawals and dividends go. Must match your BVN.'], ['Your CSCS number', 'We open it through Trust Bank Securities, or link one you already have.']]
  function finish() {
    if (!agree) { toast('Please read and accept the risk disclosure', 'bad'); return }
    if (ben.name) dispatch({ type: 'UPDATE_USER', patch: { beneficiary: { ...ben, confirmed: today() } } })
    dispatch({ type: 'SIGN_IN' })
    toast('Welcome to Vendii', 'good')
    nav(intent === 'recover' ? '/app/dividends?tab=recovery' : '/app')
  }
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, padding: '18px 40px', background: '#fff', borderBottom: '1px solid var(--line)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 20, color: 'var(--text)' }}><Logo dark />Vendii</Link>
        <span className="muted small" style={{ flex: '1 1 auto' }}>Open your investment account · about 6 minutes{intent === 'recover' ? ' · then we start your recovery' : ''}</span>
        <Pill kind="good">Progress saved. Continue on any device.</Pill>
        <Link to="/" className="small">Save and exit</Link>
      </div>
      <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 40, padding: 40, maxWidth: 1360, margin: '0 auto', width: '100%' }}>
        <aside style={{ flex: '0 1 380px', minWidth: 280, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <h1 style={{ margin: '0 12px 12px', fontSize: 24 }}>Let's set you up</h1>
          {steps.map(([t, d], i) => <button key={t} type="button" className={'wiz' + (step === i + 1 ? ' on' : '') + (step > i + 1 ? ' done' : '')} onClick={() => setStep(i + 1)}><div className="d">{step > i + 1 ? '✓' : i + 1}</div><div><div style={{ fontWeight: 600 }}>{t}</div><div className="muted small">{d}</div></div></button>)}
          <div className="card" style={{ margin: '20px 12px 0', fontSize: 13, lineHeight: 1.5 }}><div style={{ fontWeight: 600, marginBottom: 6 }}>Start small, unlock more later</div><div><strong>Tier 1</strong> BVN and selfie: invest up to ₦300,000 a month.</div><div><strong>Tier 2</strong> Add NIN: up to ₦5m a month.</div><div><strong>Tier 3</strong> Add proof of address: no limit.</div><div className="muted" style={{ marginTop: 6 }}>Sample limits; final tiers follow CBN and SEC guidance.</div></div>
          <div className="muted small" style={{ margin: '10px 12px 0' }}>Living outside Nigeria? <a href="#diaspora">Diaspora signup</a> <Pill>Phase 2</Pill></div>
        </aside>
        <section style={{ flex: '1 1 560px', minWidth: 0 }}>
          {step === 1 && <div className="card" style={{ padding: 24 }}><h2 style={{ fontSize: 22 }}>Identity confirmed</h2><div className="stack" style={{ gap: 10, marginTop: 16 }}>{[`BVN ••••••${state.user.bvnLast} · ${state.user.name} · matches NIBSS`, `NIN ••••••${state.user.ninLast} · matches NIMC`, 'Selfie matched your BVN photo'].map(t => <div className="chk" key={t}><span className="up" style={{ fontWeight: 700 }}>✓</span><span>{t}</span></div>)}</div><p className="muted small" style={{ marginTop: 14 }}>Your name has to read the same way on your BVN, your bank account and your CSCS record, or dividends and trades get stuck. We check all three for you. (Demo: verification is simulated.)</p><button className="btn btn-p btn-l" type="button" style={{ marginTop: 20 }} onClick={() => setStep(2)}>Continue</button></div>}
          {step === 2 && <div className="card" style={{ padding: 24 }}><div className="muted small">Step 2 of 5</div><h2 style={{ fontSize: 22, marginTop: 6 }}>About your investing</h2><p className="muted" style={{ marginTop: 4 }}>There are no wrong answers. This decides what we show first and when we warn you.</p>
            <div style={{ marginTop: 22 }}><div className="lbl">Have you invested in shares before?</div><div className="grid g3" style={{ gap: 10 }}>{['Never', 'A little, through a broker or app', 'Yes, I trade regularly'].map((l, i) => <button key={l} type="button" className={'opt' + (exp === i ? ' on' : '')} onClick={() => setExp(i)}>{l}</button>)}</div></div>
            <div style={{ marginTop: 18 }}><div className="lbl">If your ₦100,000 became ₦80,000 in a month, you would</div><div className="grid g3" style={{ gap: 10 }}>{['Sell to stop the loss', 'Hold and wait', 'Buy more'].map((l, i) => <button key={l} type="button" className={'opt' + (risk === i ? ' on' : '')} onClick={() => setRisk(i)}>{l}</button>)}</div></div>
            <div style={{ marginTop: 18 }}><div className="lbl">What is this money mostly for?</div><div className="grid g3" style={{ gap: 10 }}>{['Growing savings over years', 'Regular income from dividends and coupons', 'A goal within 2 years (rent, fees, a trip)'].map(l => <button key={l} type="button" className="opt">{l}</button>)}</div></div>
            <div className="grid g2" style={{ marginTop: 18 }}><div><label className="lbl" htmlFor="inc">Monthly income band</label><select id="inc" className="inp"><option>Under ₦200,000</option><option>₦200,000 to ₦500,000</option><option>₦500,000 to ₦2m</option><option>Over ₦2m</option></select></div><div><label className="lbl" htmlFor="src">Main source of funds</label><select id="src" className="inp"><option>Salary</option><option>Business income</option><option>Savings</option><option>Inheritance</option><option>Other</option></select></div></div>
            <div className="rowline" style={{ marginTop: 20 }}><span><strong>What this means for you:</strong> {LINES[Math.min(2, Math.round((exp + risk) / 2))]}</span></div>
            <div style={{ display: 'flex', gap: 12, marginTop: 22 }}><button className="btn btn-o" type="button" onClick={() => setStep(1)}>Back</button><button className="btn btn-p" type="button" onClick={() => setStep(3)}>Continue</button></div></div>}
          {step === 3 && <div className="card" style={{ padding: 24 }}><div className="muted small">Step 3 of 5</div><h2 style={{ fontSize: 22, marginTop: 6 }}>Who should inherit this account?</h2><div className="alert warn" style={{ marginTop: 12, lineHeight: 1.5 }}>About ₦270bn of Nigerian dividends sit unclaimed, much of it because a shareholder died and nobody knew the shares existed. Naming someone now takes 30 seconds and saves your family years.</div>
            <div className="grid g2" style={{ marginTop: 18 }}><div><label className="lbl" htmlFor="bn">Full name</label><input id="bn" className="inp" value={ben.name} onChange={e => setBen({ ...ben, name: e.target.value })} /></div><div><label className="lbl" htmlFor="br">Relationship</label><select id="br" className="inp" value={ben.relationship} onChange={e => setBen({ ...ben, relationship: e.target.value })}>{['Spouse', 'Child', 'Parent', 'Sibling', 'Other'].map(r => <option key={r}>{r}</option>)}</select></div><div><label className="lbl" htmlFor="bp">Phone</label><input id="bp" className="inp" value={ben.phone} onChange={e => setBen({ ...ben, phone: e.target.value })} /></div></div>
            <label className="chk" style={{ marginTop: 14 }}><input type="checkbox" defaultChecked /><span>Remind me once a year to confirm this is still right</span></label>
            <div style={{ display: 'flex', gap: 12, marginTop: 22, alignItems: 'center' }}><button className="btn btn-o" type="button" onClick={() => setStep(2)}>Back</button><button className="btn btn-p" type="button" onClick={() => setStep(4)}>Continue</button><button className="linkbtn muted" type="button" style={{ marginLeft: 'auto' }} onClick={() => setStep(4)}>Skip for now</button></div></div>}
          {step === 4 && <div className="card" style={{ padding: 24 }}><div className="muted small">Step 4 of 5</div><h2 style={{ fontSize: 22, marginTop: 6 }}>Your bank account</h2><p className="muted" style={{ marginTop: 4 }}>Withdrawals and recovered dividends go here. The account name must match your BVN.</p>
            <div className="grid g2" style={{ marginTop: 18 }}><div><label className="lbl" htmlFor="bk">Bank</label><select id="bk" className="inp" value={bank.name} onChange={e => setBank({ ...bank, name: e.target.value })}>{['GTBank', 'Zenith Bank', 'Access Bank', 'UBA', 'First Bank', 'Trust Bank'].map(b => <option key={b}>{b}</option>)}</select></div><div><label className="lbl" htmlFor="an">Account number</label><input id="an" className="inp" value={bank.number} onChange={e => setBank({ ...bank, number: e.target.value })} placeholder="10 digits" /></div></div>
            {bank.number.length === 10 && <div className="chk" style={{ marginTop: 14 }}><span className="up" style={{ fontWeight: 700 }}>✓</span><span>Account name <strong>{state.user.bank.accountName}</strong> matches your BVN (demo)</span></div>}
            <div style={{ display: 'flex', gap: 12, marginTop: 22 }}><button className="btn btn-o" type="button" onClick={() => setStep(3)}>Back</button><button className="btn btn-p" type="button" onClick={() => { if (bank.number.length !== 10) { toast('Enter a 10-digit account number', 'bad'); return } dispatch({ type: 'UPDATE_USER', patch: { bank: { name: bank.name, last4: bank.number.slice(-4), accountName: state.user.bank.accountName } } }); setStep(5) }}>Continue</button></div></div>}
          {step === 5 && <div className="card" style={{ padding: 24 }}><div className="muted small">Step 5 of 5</div><h2 style={{ fontSize: 22, marginTop: 6 }}>Your CSCS number (CHN)</h2><p className="muted" style={{ marginTop: 4 }}>Every Nigerian shareholder has a Clearing House Number. Shares sit there in your own name, not ours.</p>
            <div className="grid g2" style={{ gap: 12, marginTop: 18 }}><button type="button" className={'opt' + (chnMode === 'new' ? ' on' : '')} onClick={() => setChnMode('new')}><div style={{ fontWeight: 600 }}>Open a new CHN for me</div><div className="muted small" style={{ marginTop: 4 }}>Through Trust Bank Securities. Usually ready within 1 working day; you can fund your account meanwhile.</div></button><button type="button" className={'opt' + (chnMode === 'link' ? ' on' : '')} onClick={() => setChnMode('link')}><div style={{ fontWeight: 600, display: 'flex', gap: 8, alignItems: 'center' }}>I already have one <Pill>Phase 2</Pill></div><div className="muted small" style={{ marginTop: 4 }}>Link it and we import the shares you already hold, including ones you may have forgotten.</div></button></div>
            {chnMode === 'link' && <div style={{ marginTop: 12 }}><label className="lbl" htmlFor="chn">Your CHN</label><input id="chn" className="inp" placeholder="e.g. 1845023" /></div>}
            <label className="chk" style={{ marginTop: 18 }}><input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} /><span>I've read the <a href="#risk">risk disclosure</a> and the <a href="#terms">terms</a>. Share prices go down as well as up.</span></label>
            <div style={{ display: 'flex', gap: 12, marginTop: 22 }}><button className="btn btn-o" type="button" onClick={() => setStep(4)}>Back</button><button className="btn btn-p" type="button" onClick={finish}>Finish and see my account</button></div></div>}
        </section>
      </div>
    </div>
  )
}
