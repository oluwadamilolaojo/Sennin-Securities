import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TopBar } from '../../layouts/Shell.jsx'
import { useStore, portfolio, upcomingDividends, activeLoan, loanMetrics } from '../../store/store.jsx'
import { Pill, LiquidityPill, statusPill } from '../../components/ui.jsx'
import { naira, n2, pct, fmtDate } from '../../utils.js'
import { INDEX, STOCKS } from '../../data/mock.js'

export default function Dashboard() {
  const { state } = useStore()
  const nav = useNavigate()
  const p = portfolio(state)
  const divs = upcomingDividends(state)
  const unclaimed = state.claims.filter(c => c.owner === 'u-1' && c.status !== 'Paid')
  const unclaimedTotal = unclaimed.reduce((s, c) => s + c.amount, 0)
  const paidRecovered = state.claims.filter(c => c.owner === 'u-1' && c.status === 'Paid').reduce((s, c) => s + c.amount, 0)
  const loan = activeLoan(state)
  const lm = loan && loan.status === 'Active' ? loanMetrics(loan, state) : null
  const gainers = [...STOCKS].sort((a, b) => (b.price / b.prev) - (a.price / a.prev))
  const watch = ['SEPLAT', 'ARADEL', 'UBA', 'NGXGROUP'].map(t => STOCKS.find(s => s.ticker === t))
  const bondNext = state.bonds[0]
  return (
    <>
      <TopBar search={<input className="search" type="search" placeholder="Search a company, ticker or sector (try Dangote)" aria-label="Search" onKeyDown={e => { if (e.key === 'Enter') nav('/app/markets?q=' + encodeURIComponent(e.target.value)) }} />} />
      <div className="content">
        {lm && lm.band !== 'healthy' && (
          <div className="alert bad row" style={{ fontSize: 14 }}>
            <span><strong>Your share-backed loan needs attention.</strong> Pledged shares have fallen; the loan is now {pct(lm.ltv * 100)} of their value.</span>
            <Link to="/lend" className="btn btn-d btn-s">See what to do</Link>
          </div>
        )}
        <div className="row" style={{ alignItems: 'baseline' }}>
          <div><h2 style={{ fontSize: 26 }}>Good morning, {state.user.firstName}</h2><div className="muted">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div></div>
          <div style={{ display: 'flex', gap: 10 }}><Link className="btn btn-o" to="/app/funding">Add money</Link><Link className="btn btn-p" to="/app/markets">Buy shares</Link></div>
        </div>

        <div className="grid g3">
          <div className="card">
            <div className="muted small">Portfolio value</div>
            <div style={{ fontSize: 34, fontWeight: 700, marginTop: 6 }} className="num">{naira(p.total)}</div>
            <div style={{ marginTop: 6 }}><span className={p.dayChange >= 0 ? 'up' : 'dn'} style={{ fontWeight: 600 }}>{p.dayChange >= 0 ? '+' : ''}{naira(p.dayChange)} ({pct(p.dayChange / (p.equity || 1) * 100)})</span> <span className="muted">today</span></div>
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--soft)' }}>
              <div className="kv"><span className="muted">Total return incl. dividends</span><span className={p.totalReturn >= 0 ? 'up' : 'dn'} style={{ fontWeight: 600 }}>{pct(p.totalReturn * 100)}</span></div>
              <div className="kv"><span className="muted">Dividends received, 2026</span><strong>{naira(p.divsAll)}</strong></div>
              <div className="kv"><span className="muted">Real return (after inflation, in USD)</span><Pill>Phase 2</Pill></div>
            </div>
          </div>
          <div className="card">
            <div className="muted small">Cash</div>
            <div style={{ fontSize: 34, fontWeight: 700, marginTop: 6 }} className="num">{naira(state.cash.settled + state.cash.unsettled)}</div>
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="kv"><span>Settled, can withdraw now</span><strong>{naira(state.cash.settled)}</strong></div>
              <div className="kv"><span className="muted">Settling, lands {fmtDate(state.cash.unsettledDate)}</span><span className="muted">{naira(state.cash.unsettled)}</span></div>
              <div className="kv"><span className="muted">Reserved for open buy orders</span><span className="muted">{naira(p.reserved)}</span></div>
              <div className="rowline"><span className="small">Idle cash earning in a money market fund</span>{state.settings.flags.mmfSweep ? (state.cash.sweep ? <Pill kind="good">On, 18.2%</Pill> : <Link to="/app/funding" className="small">Turn on</Link>) : <Pill>Phase 2</Pill>}</div>
            </div>
          </div>
          <div className="card ink">
            <div style={{ color: 'var(--gold)', fontWeight: 600, fontSize: 13 }}>Unclaimed dividends being recovered</div>
            <div style={{ fontSize: 34, fontWeight: 700, marginTop: 6 }} className="num">{naira(unclaimedTotal)}</div>
            <div className="muted" style={{ marginTop: 6, fontSize: 14 }}>{unclaimed.length} claims across {new Set(unclaimed.map(c => c.registrar)).size} registrars. {naira(paidRecovered)} already paid to your bank.</div>
            <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <Link className="btn btn-g" to="/app/dividends?tab=recovery">Track recovery</Link>
              <span className="xs muted">{Math.round(state.settings.recoveryFee * 100)}% fee, only when paid</span>
            </div>
          </div>
        </div>

        <div className="grid g3">
          <div className="card tight span2">
            <div className="card-head"><h2>Holdings</h2><Link to="/app/orders?tab=statements" className="small">Download CSCS statement</Link></div>
            <div className="scroll">
              <table className="tbl">
                <thead><tr><th>Security</th><th className="num">Units</th><th className="num">Avg cost</th><th className="num">Price</th><th className="num">Value</th><th className="num">Return incl. div.</th><th>Liquidity</th><th></th></tr></thead>
                <tbody>
                  {p.rows.map(r => (
                    <tr key={r.ticker} className="click" onClick={() => nav('/app/stock/' + r.ticker)}>
                      <td><strong>{r.ticker}</strong><div className="muted xs">{r.stock.name}</div></td>
                      <td className="num">{r.units.toLocaleString()}</td><td className="num">₦{n2(r.avgCost)}</td><td className="num">₦{n2(r.price)}</td><td className="num">{naira(r.value)}</td>
                      <td className={'num ' + (r.totalReturn >= 0 ? 'up' : 'dn')}>{r.totalReturn >= 0 ? '+' : ''}{pct(r.totalReturn * 100)}</td>
                      <td><LiquidityPill level={r.stock.liquidity} /></td>
                      <td><Link to={'/app/stock/' + r.ticker} className="btn btn-o btn-s" onClick={e => e.stopPropagation()}>Trade</Link></td>
                    </tr>
                  ))}
                  {state.bonds.map(b => (
                    <tr key={b.id} className="click" onClick={() => nav('/app/fixed-income')}>
                      <td><strong>{b.name}</strong><div className="muted xs">{b.tenor}-year · {b.rate}% · matures {fmtDate(b.matures)}</div></td>
                      <td className="num">{b.units}</td><td className="num">₦1,000.00</td><td className="num">₦1,000.00</td><td className="num">{naira(b.amount)}</td><td className="num up">+{pct(b.rate / 4)}</td><td><Pill>Hold</Pill></td><td><Link to="/app/fixed-income" className="btn btn-o btn-s" onClick={e => e.stopPropagation()}>View</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="stack">
            <div className="card">
              <div className="row"><h2 style={{ fontSize: 17 }}>Dividends coming</h2><Link to="/app/dividends" className="small">All</Link></div>
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
                {divs.slice(0, 3).map(d => (
                  <div className="row" key={d.ticker + d.type} style={{ alignItems: 'flex-start' }}>
                    <div><strong>{d.ticker}</strong> {d.type.toLowerCase()} ₦{n2(d.amount)}/unit<div className="muted xs">Qualification {fmtDate(d.qual)} · Pays {fmtDate(d.pay)}</div></div>
                    <div className="num"><strong>{naira(d.net)}</strong><div className="muted xs">after 10% WHT</div></div>
                  </div>
                ))}
                {bondNext && <div className="row" style={{ alignItems: 'flex-start' }}><div><strong>FGN Savings Bond</strong> coupon<div className="muted xs">Pays {fmtDate(bondNext.nextCoupon)}</div></div><div className="num"><strong>{naira(bondNext.amount * bondNext.rate / 100 / 4)}</strong><div className="muted xs">tax free</div></div></div>}
              </div>
            </div>
            <div className="card">
              <div className="row"><h2 style={{ fontSize: 17 }}>Watchlist</h2><Link to="/app/markets" className="small">Markets</Link></div>
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
                {watch.map(s => <div className="row" key={s.ticker}><Link to={'/app/stock/' + s.ticker}><strong>{s.ticker}</strong></Link><span className="num">₦{n2(s.price)} <span className={s.price >= s.prev ? 'up' : 'dn'}>{s.price >= s.prev ? '+' : ''}{pct((s.price / s.prev - 1) * 100)}</span></span></div>)}
              </div>
            </div>
            {loan && loan.status === 'Active' && (
              <div className="card">
                <div className="row"><h2 style={{ fontSize: 17 }}>Share-backed loan</h2>{lm.band === 'healthy' ? <Pill kind="good">Healthy</Pill> : <Pill kind="bad">Action needed</Pill>}</div>
                <div className="kv" style={{ marginTop: 8 }}><span className="muted">You still owe</span><strong>{naira(loan.outstanding)}</strong></div>
                <div className="kv"><span className="muted">Loan vs shares value</span><strong>{pct(lm.ltv * 100)}</strong></div>
                <Link to="/lend" className="small">Open loan</Link>
              </div>
            )}
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 28, fontSize: 14 }}>
            <div><span className="muted xs">NGX All-Share</span><div style={{ fontWeight: 600 }} className="num">{INDEX.asi.toLocaleString('en-NG', { minimumFractionDigits: 2 })} <span className="up">+{INDEX.asiChg}%</span></div></div>
            <div><span className="muted xs">Banking index</span><div style={{ fontWeight: 600 }}>{INDEX.banking.toLocaleString('en-NG', { minimumFractionDigits: 2 })} <span className="up">+{INDEX.bankingChg}%</span></div></div>
            <div><span className="muted xs">Market cap</span><div style={{ fontWeight: 600 }}>{INDEX.mcap}</div></div>
            <div><span className="muted xs">Top gainer</span><div style={{ fontWeight: 600 }}>{gainers[0].ticker} <span className="up">+{pct((gainers[0].price / gainers[0].prev - 1) * 100)}</span></div></div>
            <div><span className="muted xs">Top loser</span><div style={{ fontWeight: 600 }}>{gainers[gainers.length - 1].ticker} <span className="dn">{pct((gainers[gainers.length - 1].price / gainers[gainers.length - 1].prev - 1) * 100)}</span></div></div>
            <div style={{ marginLeft: 'auto' }}><Link to="/app/markets" className="small">Today's market wrap</Link></div>
          </div>
        </div>
      </div>
    </>
  )
}
