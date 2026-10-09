import React from 'react'
import { Shell } from './Shell.jsx'
import { useStore, loanMetrics } from '../store/store.jsx'

export default function AdminShell() {
  const { state } = useStore()
  const deskQueue = state.orders.filter(o => ['Received', 'Sent to broker', 'On exchange', 'Partly filled', 'Queued for open'].includes(o.status)).length
  const kycQueue = state.adminUsers.filter(u => !['Verified'].includes(u.kyc)).length
  const calls = state.loans.filter(l => l.status === 'Active').filter(l => loanMetrics(l, state).band !== 'healthy').length
  const pendingLoans = state.loans.filter(l => l.status === 'Pending approval').length
  const flags = state.amlFlags.filter(f => f.status === 'Open').length + state.complaints.filter(c => c.status !== 'Resolved').length
  return (
    <Shell
      kind="admin"
      sections={[
        { items: [{ to: '/admin', label: 'Overview', end: true }] },
        { title: 'OPERATIONS', items: [
          { to: '/admin/orders', label: 'Order desk', badge: deskQueue || null },
          { to: '/admin/users', label: 'Customers and KYC', badge: kycQueue || null, badgeKind: 'warn' },
          { to: '/admin/claims', label: 'Recovery claims' },
        ] },
        { title: 'LENDING', items: [
          { to: '/admin/lending', label: 'Loan book', badge: (calls + pendingLoans) || null, badgeKind: calls ? 'bad' : 'warn' },
        ] },
        { title: 'CONTROL', items: [
          { to: '/admin/compliance', label: 'Compliance and complaints', badge: flags || null, badgeKind: 'bad' },
          { to: '/admin/settings', label: 'Fees, rates and flags' },
          { to: '/admin/audit', label: 'Audit log' },
        ] },
      ]}
      box={{ title: 'Staff view', body: 'Every action here is logged with your name and time. Customers see the results in their own apps.' }}
      footLinks={[{ to: '/app', label: 'Customer app' }, { to: '/', label: 'Website' }]}
    />
  )
}
