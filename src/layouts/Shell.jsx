import React, { useState } from 'react'
import { NavLink, Link, Outlet, useNavigate, useOutletContext } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import { Logo, Avatar, Toasts, Pill } from '../components/ui.jsx'

export function Shell({ kind, sections, box, footLinks, title }) {
  const { state, dispatch } = useStore()
  const [open, setOpen] = useState(false)
  const nav = useNavigate()
  const brandLabel = kind === 'lend' ? <>Vendii <em>Borrow</em></> : kind === 'admin' ? <>Vendii <em>Admin</em></> : 'Vendii'
  return (
    <div className="shell">
      {open && <div className="backdrop" onClick={() => setOpen(false)} />}
      <nav className={'sidenav' + (kind === 'admin' ? ' admin' : '') + (open ? ' open' : '')} aria-label="Sidebar">
        <Link className="brand" to={kind === 'lend' ? '/lend' : kind === 'admin' ? '/admin' : '/app'}><Logo />{brandLabel}</Link>
        {sections.map((sec, i) => (
          <React.Fragment key={i}>
            {sec.title && <div className="sect">{sec.title}</div>}
            {sec.items.map(it => (
              <NavLink key={it.to} to={it.to} end={it.end} className={({ isActive }) => 'item' + (isActive ? ' active' : '')} onClick={() => setOpen(false)}>
                {it.label}{it.badge ? <Pill kind={it.badgeKind || 'gold'}>{it.badge}</Pill> : null}
              </NavLink>
            ))}
          </React.Fragment>
        ))}
        <div className="spacer" />
        {box && <div className="box"><b>{box.title}</b>{box.body}</div>}
        <div className="foot" style={{ marginTop: 8 }}>
          {footLinks.map(l => <Link key={l.to} to={l.to}>{l.label}</Link>)}
          <a href="#signout" onClick={e => { e.preventDefault(); dispatch({ type: 'SIGN_OUT' }); nav('/') }}>Sign out</a>
        </div>
      </nav>
      <div className="main">
        <Outlet context={{ openMenu: () => setOpen(true) }} />
        <Toasts />
      </div>
    </div>
  )
}

export function TopBar({ title, children, search, plain }) {
  const { state } = useStore()
  const { openMenu } = useOutletContext() || {}
  const unread = state.notifications.filter(n => !n.read).length
  const shock = state.settings.marketShock
  return (
    <div className="topbar">
      <button className="btn btn-o btn-s menubtn" type="button" onClick={openMenu} aria-label="Open menu">Menu</button>
      {title && <h1>{title}</h1>}
      {search}
      {children}
      <div className="mkt"><span className={'dot' + (shock > 0 ? ' bad' : '')} /><span style={{ fontWeight: 600 }}>{shock > 0 ? `Market down ${Math.round(shock * 100)}%` : 'NGX open'}</span><span className="muted">{state.settings.flags.realtimePrices ? 'Live prices' : 'Prices delayed 15 min'}</span></div>
      <Link to="/app/notifications" className="btn btn-o btn-s">{unread ? `${unread} new` : 'Alerts'}</Link>
      {!plain && <Link to="/app/settings" aria-label="Account"><Avatar name={state.user.name} /></Link>}
    </div>
  )
}
