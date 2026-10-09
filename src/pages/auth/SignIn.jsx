import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useStore } from '../../store/store.jsx'
import { Logo } from '../../components/ui.jsx'

export default function SignIn() {
  const { dispatch, toast } = useStore()
  const nav = useNavigate()
  const [sp] = useSearchParams()
  const staff = sp.get('staff') === '1'
  const [email, setEmail] = useState(staff ? 'ops@vendii.ng' : 'damilola@example.com')
  const [pw, setPw] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState(1)
  function go(e) {
    e.preventDefault()
    if (step === 1) { if (!email || pw.length < 4) { toast('Enter your email and password', 'bad'); return } setStep(2); return }
    if (otp.length < 6) { toast('Enter the 6-digit code', 'bad'); return }
    dispatch({ type: 'SIGN_IN', admin: staff })
    nav(sp.get('next') || (staff ? '/admin' : '/app'))
  }
  return (
    <div className="auth">
      <div className="side">
        <Link to="/" className="brand" style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 22 }}><Logo />Vendii</Link>
        <div><h1 style={{ fontSize: 40, lineHeight: 1.05, maxWidth: '12em' }}>{staff ? 'Staff console' : 'Everything you own on the Nigerian market, in one place.'}</h1><p style={{ color: '#C9D6E4', marginTop: 16, maxWidth: '30em', fontSize: 17 }}>{staff ? 'Order desk, KYC, recovery claims, the loan book, compliance and settings. Every action is logged with your name.' : 'Your shares sit at CSCS in your own name. Your cash sits with Trust Bank Securities. We never ask for your PIN.'}</p></div>
        <p className="small" style={{ color: '#C9D6E4' }}>Licensed by SEC Nigeria as a digital sub-broker [registration number]</p>
      </div>
      <div className="form"><div>
        <h2 style={{ fontSize: 26 }}>{staff ? 'Staff sign in' : 'Sign in'}</h2>
        <p className="muted" style={{ marginTop: 6 }}>{step === 1 ? 'Demo: any password with 4 or more characters.' : `We sent a 6-digit code to the phone on this account. Demo: any 6 digits.`}</p>
        <form onSubmit={go} className="stack" style={{ gap: 14, marginTop: 24 }}>
          {step === 1 ? (<>
            <div><label className="lbl" htmlFor="em">Email or phone</label><input id="em" className="inp" value={email} onChange={e => setEmail(e.target.value)} autoComplete="username" /></div>
            <div><label className="lbl" htmlFor="pw">Password</label><input id="pw" className="inp" type="password" value={pw} onChange={e => setPw(e.target.value)} autoComplete="current-password" /></div>
          </>) : (
            <div><label className="lbl" htmlFor="otp">Code</label><input id="otp" className="inp" inputMode="numeric" maxLength="6" value={otp} onChange={e => setOtp(e.target.value)} placeholder="••••••" style={{ letterSpacing: '.3em', fontSize: 20, maxWidth: 200 }} /></div>
          )}
          <button className="btn btn-p btn-l" type="submit">{step === 1 ? 'Continue' : 'Sign in'}</button>
        </form>
        <div className="muted small" style={{ marginTop: 18, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {!staff && <Link to="/signup">Open an account</Link>}
          <a href="#forgot">Forgotten password</a>
          <Link to={staff ? '/signin' : '/signin?staff=1'}>{staff ? 'Customer sign in' : 'Staff sign in'}</Link>
        </div>
      </div></div>
    </div>
  )
}
