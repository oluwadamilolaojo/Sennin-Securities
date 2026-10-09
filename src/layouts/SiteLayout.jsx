import React, { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Logo, Toasts } from '../components/ui.jsx'
import { useStore } from '../store/store.jsx'

export default function SiteLayout() {
  const [open, setOpen] = useState(false)
  const { state } = useStore()
  return (
    <div className="site">
      <div className="notice" role="region" aria-label="Important notice">
        <div className="wrap">
          <span>Vendii staff will never ask for your PIN, OTP or card details, and never ask you to pay into an account that isn't in your own name.</span>
          <span><Link to="/safety">Verify us on the SEC register</Link></span>
        </div>
      </div>
      <header>
        <div className="wrap">
          <Link className="brand" to="/" aria-label="Vendii home"><Logo size={32} />Vendii</Link>
          <nav className={'main' + (open ? ' open' : '')} aria-label="Main">
            {[['/check', 'Find dividends'], ['/invest', 'Invest'], ['/borrow', 'Borrow'], ['/pricing', 'Pricing'], ['/safety', 'Safety'], ['/learn', 'Learn']].map(([to, l]) => (
              <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setOpen(false)}>{l}</NavLink>
            ))}
          </nav>
          <div className="headcta">
            <Link className="signin" to={state.auth.signedIn ? '/app' : '/signin'}>{state.auth.signedIn ? 'Open my account' : 'Sign in'}</Link>
            <Link className="btn btn-g" to="/check">Check my dividends</Link>
          </div>
          <button className="menubtn" type="button" aria-expanded={open} onClick={() => setOpen(o => !o)}>Menu</button>
        </div>
      </header>
      <main><Outlet /></main>
      <footer>
        <div className="wrap">
          <div className="fgrid">
            <div>
              <Link className="brand" to="/" style={{ color: '#fff' }}><Logo size={30} />Vendii</Link>
              <p style={{ marginTop: 14, maxWidth: '22em' }}>Find, recover, invest and borrow against what you own on the Nigerian market.</p>
              <p style={{ marginTop: 14 }}>[Office address], Lagos<br />[Support phone] · [support email]</p>
            </div>
            <div><h4>Products</h4><ul><li><Link to="/check">Dividend check</Link></li><li><Link to="/invest">Invest</Link></li><li><Link to="/borrow">Borrow</Link></li><li><Link to="/pricing">Pricing</Link></li></ul></div>
            <div><h4>Trust</h4><ul><li><Link to="/safety">Safety and licences</Link></li><li><Link to="/pricing">How we make money</Link></li><li><Link to="/safety#status">Service status</Link></li><li><Link to="/safety#complaints">Complaints</Link></li></ul></div>
            <div><h4>Learn</h4><ul><li><Link to="/learn#calendar">Dividend calendar</Link></li><li><Link to="/learn#bond">Bond calculator</Link></li><li><Link to="/learn">Guides</Link></li><li><Link to="/#faq">FAQ</Link></li></ul></div>
            <div><h4>Company</h4><ul><li><Link to="/safety">About</Link></li><li><Link to="/borrow#partners">For banks and brokers</Link></li><li><Link to="/admin">Staff login</Link></li><li><Link to="/safety#legal">Terms and privacy</Link></li></ul></div>
          </div>
          <div className="disc">
            <p><strong>[Vendii legal entity name]</strong>, RC [number], is registered with the Securities and Exchange Commission, Nigeria, as a digital sub-broker (registration [number]). Trades in Nigerian securities are executed through Trust Bank Securities Limited, a broker-dealer registered with the SEC and a trading licence holder of the Nigerian Exchange. Share-backed loans are provided by Trust Bank and arranged by Vendii.</p>
            <p>Vendii does not give investment advice. The value of investments can go down as well as up, and you may get back less than you put in. Borrowing against shares carries the risk that pledged shares are sold if their value falls. Read the full risk disclosure before investing or borrowing.</p>
            <p>Dividend recovery estimates are indicative and depend on registrar records. Complaints not resolved by Vendii can be escalated to the SEC.</p>
            <p>© 2026 Vendii. Registered with the Nigeria Data Protection Commission.</p>
          </div>
        </div>
      </footer>
      <Toasts />
    </div>
  )
}
