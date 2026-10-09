import React from 'react'
import { Outlet } from 'react-router-dom'
import { Shell } from './Shell.jsx'
import { useStore, activeLoan, loanMetrics } from '../store/store.jsx'

export default function AppShell() {
  const { state } = useStore()
  const unread = state.notifications.filter(n => !n.read).length
  const claimsNeedingAction = state.claims.filter(c => c.owner === 'u-1' && c.status === 'Action needed').length
  return (
    <Shell
      kind="app"
      sections={[{ items: [
        { to: '/app', label: 'Home', end: true },
        { to: '/app/markets', label: 'Markets' },
        { to: '/app/orders', label: 'Orders' },
        { to: '/app/fixed-income', label: 'Fixed income' },
        { to: '/app/dividends', label: 'Dividends', badge: claimsNeedingAction || null, badgeKind: 'warn' },
        { to: '/app/funding', label: 'Funding' },
        { to: '/lend', label: 'Borrow against shares', badge: 'New' },
      ] }, { title: 'ACCOUNT', items: [
        { to: '/app/notifications', label: 'Notifications', badge: unread || null, badgeKind: 'gold' },
        { to: '/app/settings', label: 'Settings and security' },
        { to: '/app/support', label: 'Help and complaints' },
      ] }]}
      box={{ title: 'Your shares, your name', body: <>Held at CSCS under CHN {state.user.chn}. Sponsoring broker: Trust Bank Securities.<div style={{ marginTop: 8 }}><span className="dot" style={{ marginRight: 6 }} />All systems normal</div></> }}
      footLinks={[{ to: '/', label: 'Vendii website' }, { to: '/admin', label: 'Staff console' }]}
    />
  )
}
