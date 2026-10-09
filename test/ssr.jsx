import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { StoreProvider } from '../src/store/store.jsx'
import { AppRoutes } from '../src/App.jsx'
import { SETTINGS } from '../src/data/mock.js'

const routes = ['/', '/check', '/check?mode=family', '/invest', '/borrow', '/pricing', '/safety', '/learn', '/signin', '/signin?staff=1', '/signup',
  '/app', '/app/markets', '/app/stock/ZENITHBANK', '/app/stock/NAHCO', '/app/stock/NOPE', '/app/orders', '/app/orders?tab=statements', '/app/fixed-income', '/app/dividends', '/app/dividends?tab=recovery', '/app/dividends?tab=mandates', '/app/dividends?tab=history', '/app/funding', '/app/settings', '/app/settings?tab=beneficiary', '/app/settings?tab=bank', '/app/settings?tab=security', '/app/settings?tab=prefs', '/app/support', '/app/support?tab=chat', '/app/support?tab=complaints', '/app/support?tab=status', '/app/notifications',
  '/lend', '/lend/start', '/lend/build', '/lend/review', '/lend/documents', '/lend/learn',
  '/admin', '/admin/orders', '/admin/users', '/admin/claims', '/admin/lending', '/admin/compliance', '/admin/settings', '/admin/audit']
let fail = 0
for (const shock of [0, 0.58]) {
  for (const r of routes) {
    try {
      const html = renderToString(
        <StoreProvider override={{ auth: { signedIn: true, admin: true }, settings: { ...SETTINGS, marketShock: shock }, draftLoan: { sel: ['MTNN'], amount: 500000, tenor: 6, plan: 'Monthly', purpose: 'Personal', collateral: [{ ticker: 'MTNN', units: 3500 }], interest: 1, fee: 1, lien: 2500, total: 1, apr: 30, coll: 900000, payment: 1 } }}>
          <MemoryRouter initialEntries={[r]}><AppRoutes /></MemoryRouter>
        </StoreProvider>)
      if (html.length < 500) { console.log('SHORT', r, html.length) }
    } catch (e) { fail++; console.log('FAIL', r, 'shock', shock, e.message.split('\n')[0]) }
  }
}
console.log(fail ? fail + ' failures' : 'ALL ROUTES RENDER')
