import React from 'react'
import { Link } from 'react-router-dom'
import { Pill, LiquidityPill } from '../../components/ui.jsx'
import { STOCKS, BOND_WINDOW } from '../../data/mock.js'
import { n2, pct } from '../../utils.js'
import Waitlist from './Waitlist.jsx'

export default function Invest() {
  return (
    <>
      <div className="wrap page-hero"><Pill>Opens November 2026</Pill><h1 style={{ marginTop: 12 }}>Invest in Nigerian shares, ETFs and government bonds, with every charge in the open.</h1><p>Buy by naira amount. See commission, SEC, NGX and CSCS fees, stamp duty and VAT before you confirm. Your shares sit at CSCS in your own name, never ours.</p><div style={{ display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap' }}><Link className="btn btn-p btn-l" to="/signup">Join the waitlist</Link><Link className="btn btn-l" to="/app" style={{ border: '1.5px solid var(--line)', color: 'var(--text)' }}>Try the demo account</Link></div></div>
      <section className="block alt"><div className="wrap">
        <div className="sechead"><h2>What you can buy</h2></div>
        <div className="grid g3" style={{ marginTop: 36 }}>
          {[['NGX shares', 'Every company on the Nigerian Exchange, from banks to cement to telecoms. Whole units, limit or market orders, with a liquidity label so you know how easily you can sell.', 'Launch'], ['ETFs', 'Exchange-traded funds that track an index, bought and sold like a share. We show the NAV against the price so you see any premium.', 'Launch'], ['FGN Savings Bond', `Monthly government bond from ₦5,000. This month: ${BOND_WINDOW.rates[2]}% for 2 years, ${BOND_WINDOW.rates[3]}% for 3 years, paid quarterly, tax free.`, 'Launch'], ['Treasury bills', 'T-bill yields for small tickets through a pooled partner fund, since direct auctions need over ₦50m.', 'Phase 2'], ['Money market funds', 'Where idle cash goes to earn, and where many Nigerians already save.', 'Phase 2'], ['NASD OTC', 'Unlisted public companies traded on the NASD over-the-counter market.', 'Phase 3']].map(([h, p, ph]) => <div className="card" key={h}><div className="row"><h3 style={{ fontSize: 19 }}>{h}</h3><Pill kind={ph === 'Launch' ? 'good' : 'grey'}>{ph}</Pill></div><p className="muted" style={{ marginTop: 8 }}>{p}</p></div>)}
        </div>
      </div></section>
      <section className="block"><div className="wrap">
        <div className="sechead"><h2>Public stock pages, for everyone</h2><p>Every NGX ticker gets a page with price, dividend history and how easily it trades. No account needed.</p></div>
        <div className="tablebox" style={{ marginTop: 36 }}><table className="ptable"><thead><tr><th>Security</th><th>Sector</th><th>Price</th><th>Dividend yield</th><th>Liquidity</th></tr></thead><tbody>
          {STOCKS.slice(0, 8).map(s => <tr key={s.ticker}><td><Link to={'/app/stock/' + s.ticker}>{s.ticker}</Link><div className="muted small">{s.name}</div></td><td>{s.sector}</td><td className="num">₦{n2(s.price)}</td><td>{pct(s.yld)}</td><td><LiquidityPill level={s.liquidity} /></td></tr>)}
        </tbody></table></div>
        <div className="alert warn" style={{ marginTop: 20, maxWidth: 820 }}>Public offers and IPOs appear here only once the SEC has approved them. Vendii does not pre-market offers.</div>
      </div></section>
      <Waitlist />
    </>
  )
}
