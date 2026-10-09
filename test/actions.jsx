import React, { useEffect } from 'react'
import { renderToString } from 'react-dom/server'
import { StoreProvider, useStore, loanMetrics, activeLoan, portfolio } from '../src/store/store.jsx'

function Probe() {
  const { state, dispatch } = useStore()
  // run a sequence of reducer actions by calling reducer indirectly through dispatch is async in SSR; so we test selectors here
  const p = portfolio(state)
  const loan = activeLoan(state)
  const m = loanMetrics(loan, state)
  return <div>{p.total}|{m.ltv.toFixed(3)}|{m.band}|{m.schedule.length}</div>
}
const html = renderToString(<StoreProvider override={{ auth: { signedIn: true } }}><Probe /></StoreProvider>)
console.log('selectors', html)
