import React from 'react'
import { Shell } from './Shell.jsx'
import { useStore, activeLoan, loanMetrics } from '../store/store.jsx'

export default function LendShell() {
  const { state } = useStore()
  const loan = activeLoan(state)
  const m = loan && loan.status === 'Active' ? loanMetrics(loan, state) : null
  const badge = m && m.band !== 'healthy' ? (m.band === 'warning' ? 'Warning' : 'Action') : null
  return (
    <Shell
      kind="lend"
      sections={[{ items: [
        { to: '/lend', label: 'My loan', end: true, badge, badgeKind: m?.band === 'warning' ? 'warn' : 'bad' },
        { to: '/lend/start', label: 'Check what you can borrow' },
        { to: '/lend/build', label: 'Build a loan' },
        { to: '/lend/documents', label: 'Documents and statements' },
        { to: '/lend/learn', label: 'How it works' },
      ] }]}
      box={{ title: 'Who lends', body: 'Loans are provided by Trust Bank. Vendii arranges them. Your shares stay in your name at CSCS with a lien in the bank\'s favour until you repay.' }}
      footLinks={[{ to: '/app', label: 'Back to Vendii Trading' }, { to: '/app/support', label: 'Talk to us' }]}
    />
  )
}
