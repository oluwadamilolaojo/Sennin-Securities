import React, { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { TopBar } from '../../layouts/Shell.jsx'
import { useStore } from '../../store/store.jsx'
import { LiquidityPill, Pill, Tabs } from '../../components/ui.jsx'
import { n2, pct } from '../../utils.js'
import { STOCKS, INDEX } from '../../data/mock.js'

const COLLECTIONS = [
  { key: 'all', label: 'All securities', filter: () => true },
  { key: 'ngx30', label: 'NGX 30 names', filter: s => s.liquidity === 'High' || s.ticker === 'DANGCEM' },
  { key: 'dividend', label: 'Dividend payers', filter: s => s.yld >= 4 },
  { key: 'banks', label: 'Banks', filter: s => s.sector === 'Banking' },
  { key: 'under100', label: 'Under ₦100', filter: s => s.price < 100 },
  { key: 'etf', label: 'ETFs', filter: s => s.etf },
]

export default function Markets() {
  const { state } = useStore()
  const nav = useNavigate()
  const [sp] = useSearchParams()
  const [q, setQ] = useState(sp.get('q') || '')
  const [coll, setColl] = useState('all')
  const [sort, setSort] = useState('name')
  const [sector, setSector] = useState('All')
  const [minLiq, setMinLiq] = useState('Any')
  const sectors = ['All', ...new Set(STOCKS.map(s => s.sector))]
  const rows = useMemo(() => {
    const f = COLLECTIONS.find(c => c.key === coll).filter
    const ql = q.trim().toLowerCase()
    const liqRank = { High: 3, Medium: 2, Thin: 1 }
    let r = STOCKS.filter(f).filter(s => !ql || s.ticker.toLowerCase().includes(ql) || s.name.toLowerCase().includes(ql) || s.sector.toLowerCase().includes(ql))
      .filter(s => sector === 'All' || s.sector === sector).filter(s => minLiq === 'Any' || liqRank[s.liquidity] >= liqRank[minLiq])
    const chg = s => s.price / s.prev - 1
    if (sort === 'gainers') r = [...r].sort((a, b) => chg(b) - chg(a))
    if (sort === 'losers') r = [...r].sort((a, b) => chg(a) - chg(b))
    if (sort === 'yield') r = [...r].sort((a, b) => b.yld - a.yld)
    if (sort === 'value') r = [...r].sort((a, b) => b.avgValue - a.avgValue)
    if (sort === 'name') r = [...r].sort((a, b) => a.ticker.localeCompare(b.ticker))
    return r
  }, [q, coll, sort, sector, minLiq])
  const shock = state.settings.marketShock
  return (
    <>
      <TopBar title="Markets" search={<input className="search" type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search a company, ticker or sector" aria-label="Search securities" />} />
      <div className="content">
        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 28, fontSize: 14 }}>
            <div><span className="muted xs">NGX All-Share</span><div style={{ fontWeight: 600 }} className="num">{INDEX.asi.toLocaleString('en-NG', { minimumFractionDigits: 2 })} <span className="up">+{INDEX.asiChg}%</span></div></div>
            <div><span className="muted xs">Banking index</span><div style={{ fontWeight: 600 }}>{INDEX.banking.toLocaleString('en-NG', { minimumFractionDigits: 2 })} <span className="up">+{INDEX.bankingChg}%</span></div></div>
            <div><span className="muted xs">Deals today</span><div style={{ fontWeight: 600 }}>{STOCKS.reduce((a, s) => a + s.deals, 0).toLocaleString()}</div></div>
            <div><span className="muted xs">Market wrap</span><div style={{ fontWeight: 600 }}>Banks led; cement and telecoms steady. {shock > 0 ? `Simulated fall of ${Math.round(shock * 100)}% applied.` : ''}</div></div>
          </div>
        </div>
        <div className="card tight">
          <Tabs tabs={COLLECTIONS.map(c => ({ value: c.key, label: c.label }))} value={coll} onChange={setColl} />
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', padding: '14px 20px', alignItems: 'center' }}>
            <label className="small muted">Sort <select className="inp" style={{ height: 38, width: 'auto', display: 'inline-block', marginLeft: 6 }} value={sort} onChange={e => setSort(e.target.value)}><option value="name">Name</option><option value="gainers">Top gainers</option><option value="losers">Top losers</option><option value="yield">Dividend yield</option><option value="value">Most traded</option></select></label>
            <label className="small muted">Sector <select className="inp" style={{ height: 38, width: 'auto', display: 'inline-block', marginLeft: 6 }} value={sector} onChange={e => setSector(e.target.value)}>{sectors.map(s => <option key={s}>{s}</option>)}</select></label>
            <label className="small muted">Liquidity at least <select className="inp" style={{ height: 38, width: 'auto', display: 'inline-block', marginLeft: 6 }} value={minLiq} onChange={e => setMinLiq(e.target.value)}><option>Any</option><option>Medium</option><option>High</option></select></label>
            <span className="muted small" style={{ marginLeft: 'auto' }}>{rows.length} securities · prices delayed 15 min</span>
          </div>
          <div className="scroll">
            <table className="tbl">
              <thead><tr><th>Security</th><th>Sector</th><th className="num">Price</th><th className="num">Today</th><th className="num">Div. yield</th><th className="num">P/E</th><th>Liquidity</th><th className="num">Avg daily value</th><th></th></tr></thead>
              <tbody>
                {rows.map(s => {
                  const px = s.price * (1 - shock), chg = s.price / s.prev - 1
                  return (
                    <tr key={s.ticker} className="click" onClick={() => nav('/app/stock/' + s.ticker)}>
                      <td><strong>{s.ticker}</strong><div className="muted xs">{s.name}</div></td>
                      <td>{s.sector}{s.etf && <Pill style={{ marginLeft: 6 }}>ETF</Pill>}</td>
                      <td className="num">₦{n2(px)}</td>
                      <td className={'num ' + (chg >= 0 ? 'up' : 'dn')}>{chg >= 0 ? '+' : ''}{pct(chg * 100)}</td>
                      <td className="num">{pct(s.yld)}</td><td className="num">{s.pe ? s.pe + 'x' : 'n/a'}</td>
                      <td><LiquidityPill level={s.liquidity} /></td>
                      <td className="num">₦{(s.avgValue / 1e6).toFixed(0)}m</td>
                      <td><Link to={'/app/stock/' + s.ticker} className="btn btn-o btn-s" onClick={e => e.stopPropagation()}>Trade</Link></td>
                    </tr>
                  )
                })}
                {!rows.length && <tr><td colSpan="9" className="muted" style={{ textAlign: 'center', padding: 30 }}>Nothing matches. Try the company name, for example Dangote.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="card-foot">Collections help you find companies. They are not recommendations. <Link to="/app/fixed-income">Looking for bonds?</Link></div>
        </div>
      </div>
    </>
  )
}
