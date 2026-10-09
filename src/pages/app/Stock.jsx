import React, { useState, useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { TopBar } from '../../layouts/Shell.jsx'
import { useStore, stockOf, priceOf, portfolio } from '../../store/store.jsx'
import { Pill, LiquidityPill, Seg, Sparkline, Modal, Tabs } from '../../components/ui.jsx'
import { naira, n2, n0, pct, fmtDate, computeFees, uid, today } from '../../utils.js'

export default function Stock() {
  const { ticker } = useParams()
  const { state, dispatch, toast } = useStore()
  const nav = useNavigate()
  const s = stockOf(ticker)
  const [side, setSide] = useState('Buy')
  const [type, setType] = useState('Market')
  const [mode, setMode] = useState('amount')
  const [amount, setAmount] = useState(100000)
  const [units, setUnits] = useState(2000)
  const [limit, setLimit] = useState(s ? s.price : 0)
  const [validity, setValidity] = useState('Day')
  const [tab, setTab] = useState('dividends')
  const [confirm, setConfirm] = useState(false)
  const [pin, setPin] = useState('')
  const [range, setRange] = useState('6M')
  if (!s) return <><TopBar title="Not found" /><div className="content"><div className="card">No security called {ticker}. <Link to="/app/markets">Back to markets</Link></div></div></>
  const last = priceOf(ticker, state.settings)
  const held = state.holdings.find(h => h.ticker === ticker)
  const px = type === 'Limit' ? (Number(limit) || last) : last
  const u = mode === 'amount' ? Math.floor((Number(amount) || 0) / px) : (Number(units) || 0)
  const cons = u * px
  const fees = computeFees(cons, state.settings)
  const total = side === 'Buy' ? cons + fees.total : cons - fees.total
  const change = mode === 'amount' ? Math.max(0, (Number(amount) || 0) - cons) : 0
  const band = type === 'Limit' && (px < last * 0.9 || px > last * 1.1)
  const notEnoughCash = side === 'Buy' && total > state.cash.settled
  const notEnoughUnits = side === 'Sell' && u > (held?.units || 0)
  const chg = s.price / s.prev - 1
  const canSubmit = u > 0 && !band && !notEnoughCash && !notEnoughUnits
  const history = useMemo(() => ({ '1W': s.history.slice(-5), '1M': s.history.slice(-8), '6M': s.history, '1Y': s.history.concat(s.history.map(v => v * 1.08)).slice(0, 26) }[range] || s.history), [range, s])

  function place() {
    if (pin.length < 4) { toast('Enter your 4-digit PIN', 'bad'); return }
    const order = { id: 'VND-26-' + String(4816 + state.orders.length).padStart(6, '0'), ts: today(), side, ticker, units: u, filled: 0, type, limit: type === 'Limit' ? px : null, status: 'Received', validity, owner: 'u-1', timeline: [['Received', today()]] }
    dispatch({ type: 'PLACE_ORDER', order })
    setConfirm(false); setPin('')
    toast(`${side} order for ${n0(u)} ${ticker} received`, 'good')
    nav('/app/orders')
  }

  return (
    <>
      <TopBar search={<input className="search" type="search" defaultValue={s.name} aria-label="Search" onKeyDown={e => { if (e.key === 'Enter') nav('/app/markets?q=' + encodeURIComponent(e.target.value)) }} />}>
        <Link to="/app/markets" className="small">All markets</Link>
      </TopBar>
      <div className="content">
        <div className="grid g3" style={{ alignItems: 'start' }}>
          <div className="span2 stack">
            <div className="card">
              <div className="row" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}><h1 style={{ fontSize: 24 }}>{s.ticker}</h1><Pill>{s.sector}</Pill><LiquidityPill level={s.liquidity} />{s.bank && <Pill kind="info">Bank share</Pill>}</div>
                  <div className="muted small">{s.name} · NGX Main Board</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 12 }}><span style={{ fontSize: 36, fontWeight: 700 }} className="num">₦{n2(last)}</span><span className={chg >= 0 ? 'up' : 'dn'} style={{ fontSize: 16, fontWeight: 600 }}>{chg >= 0 ? '+' : ''}₦{n2(s.price - s.prev)} ({pct(chg * 100)})</span><span className="muted small">today</span></div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-o btn-s" type="button" onClick={() => toast('Added to your watchlist')}>Add to watchlist</button>
                  <button className="btn btn-o btn-s" type="button" onClick={() => toast(state.settings.flags.trading ? 'Price alert set for ₦' + n2(last * 1.05) : 'Alerts open in Phase 2')}>Set price alert</button>
                </div>
              </div>
              <div style={{ marginTop: 16 }}><Sparkline data={history} /></div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>{['1W', '1M', '6M', '1Y'].map(r => <button key={r} type="button" className="btn btn-s" style={{ background: range === r ? 'var(--ink)' : 'var(--soft)', color: range === r ? '#fff' : 'var(--ink)' }} onClick={() => setRange(r)}>{r}</button>)}</div>
              <div className="grid g4" style={{ marginTop: 20, fontSize: 14, gap: 14 }}>
                {[['Market cap', s.mcap], ['P/E', s.pe ? s.pe + 'x' : 'n/a'], ['Dividend yield', pct(s.yld)], ['52-week range', `₦${n2(s.low52)} to ₦${n2(s.high52)}`], ['Avg daily value (30d)', '₦' + (s.avgValue / 1e9 >= 1 ? (s.avgValue / 1e9).toFixed(1) + 'bn' : (s.avgValue / 1e6).toFixed(0) + 'm')], ['Deals today', s.deals.toLocaleString()], ['Bid / Ask', `₦${n2(s.bid)} / ₦${n2(s.ask)}`], ['Next dividend', s.nextDiv ? `₦${n2(s.nextDiv.amount)}, qualifies ${fmtDate(s.nextDiv.qual)}` : 'None declared']].map(([k, v]) => <div key={k}><div className="muted xs">{k}</div><div style={{ fontWeight: 600 }}>{v}</div></div>)}
              </div>
              {s.liquidity === 'Thin' && <div className="alert warn" style={{ marginTop: 16 }}>This stock traded on few days this month ({s.deals} deals today). Buying is easy; selling may take days or weeks. We default you to a limit order.</div>}
              {s.etf && <div className="alert info" style={{ marginTop: 16 }}>{s.about}</div>}
            </div>
            <div className="card tight">
              <Tabs tabs={[{ value: 'dividends', label: 'Dividends' }, { value: 'disclosures', label: 'Disclosures' }, { value: 'results', label: 'Results in plain words' }, { value: 'why', label: 'Why did it move' }, { value: 'about', label: 'About' }]} value={tab} onChange={setTab} />
              <div style={{ padding: 20 }}>
                {tab === 'dividends' && (
                  <div className="scroll"><table className="tbl">
                    <thead><tr><th>Type</th><th className="num">Per unit</th><th>Qualification</th><th>Payment</th><th className="num">You'd get (after 10% WHT)</th></tr></thead>
                    <tbody>
                      {s.nextDiv && <tr><td>{s.nextDiv.type}</td><td className="num">₦{n2(s.nextDiv.amount)}</td><td>{fmtDate(s.nextDiv.qual)}</td><td>{fmtDate(s.nextDiv.pay)}</td><td className="num">{held ? naira(held.units * s.nextDiv.amount * 0.9) : <span className="muted">no holding</span>}</td></tr>}
                      {s.pastDivs.map(d => <tr key={d.type}><td>{d.type}</td><td className="num">₦{n2(d.amount)}</td><td>{fmtDate(d.qual)}</td><td>{fmtDate(d.pay)}</td><td className="num">{held ? <>{naira(held.units * d.amount * 0.9)} <Pill kind="good">Paid</Pill></> : <span className="muted">no holding</span>}</td></tr>)}
                      {!s.nextDiv && !s.pastDivs.length && <tr><td colSpan="5" className="muted">No dividend history on file.</td></tr>}
                    </tbody></table>
                    <div className="muted xs" style={{ marginTop: 10 }}>Own the shares before the qualification date to receive the dividend.</div></div>
                )}
                {tab === 'disclosures' && <div className="stack" style={{ gap: 10 }}><Pill>Phase 2</Pill><p className="muted">Results, board meetings and corporate notices from NGX filings will appear here in plain language.</p><div className="rowline"><span>Board meeting notice for Q3 results</span><span className="muted small">sample · 3 Oct</span></div><div className="rowline"><span>Closed period begins ahead of results</span><span className="muted small">sample · 1 Oct</span></div></div>}
                {tab === 'results' && <div className="stack" style={{ gap: 10 }}><Pill>Phase 3</Pill><p className="muted">A three-line summary of each set of results: revenue, profit and dividend against last year.</p></div>}
                {tab === 'why' && <div className="stack" style={{ gap: 10 }}><Pill>Phase 3</Pill><p className="muted">A short, AI-written explanation of today's move built from filings and news. Labelled as information, never advice.</p></div>}
                {tab === 'about' && <p>{s.about}</p>}
              </div>
            </div>
          </div>

          <div className="card">
            <Seg options={[{ value: 'Buy', label: 'Buy' }, { value: 'Sell', label: 'Sell' }]} value={side} onChange={setSide} ariaLabel="Buy or sell" />
            {!state.settings.flags.trading && <div className="alert warn" style={{ marginTop: 12 }}>Trading is paused right now. See the status page for details.</div>}
            <div style={{ marginTop: 18 }}>
              <div className="row"><span className="lbl">Order type</span><span className="xs muted">Market fills now. Limit waits for your price.</span></div>
              <Seg options={[{ value: 'Market', label: 'Market' }, { value: 'Limit', label: 'Limit' }]} value={type} onChange={v => { setType(v); if (v === 'Limit' && s.liquidity === 'Thin') setLimit(s.price) }} ariaLabel="Order type" />
            </div>
            {type === 'Limit' && (
              <div style={{ marginTop: 14 }}>
                <label className="lbl" htmlFor="lp">Limit price (₦ per unit)</label>
                <input id="lp" className="inp" type="number" step="0.05" value={limit} onChange={e => setLimit(e.target.value)} />
                {band && <div className="alert warn" style={{ marginTop: 8 }}>This price is outside today's allowed range for {ticker} (₦{n2(last * 0.9)} to ₦{n2(last * 1.1)}). The exchange will reject it.</div>}
              </div>
            )}
            <div style={{ marginTop: 14 }}>
              <div className="row"><span className="lbl">I want to {side.toLowerCase()}</span><span className="xs"><button className="linkbtn" type="button" style={{ fontWeight: mode === 'amount' ? 700 : 400 }} onClick={() => setMode('amount')}>by amount</button> · <button className="linkbtn" type="button" style={{ fontWeight: mode === 'units' ? 700 : 400 }} onClick={() => setMode('units')}>by units</button></span></div>
              {mode === 'amount'
                ? <><input className="inp" type="number" step="1000" value={amount} onChange={e => setAmount(e.target.value)} aria-label="Amount in naira" /><div className="muted xs" style={{ marginTop: 6 }}>Shares trade in whole units. ₦{n0(amount)} {side === 'Buy' ? 'buys' : 'sells'} <strong>{n0(u)} units</strong> at ₦{n2(px)}; ₦{n0(change)} stays as cash.</div></>
                : <><input className="inp" type="number" step="100" value={units} onChange={e => setUnits(e.target.value)} aria-label="Number of units" /><div className="muted xs" style={{ marginTop: 6 }}>{n0(u)} units at ₦{n2(px)} = {naira(cons)}{held && side === 'Sell' ? ` · you hold ${n0(held.units)}` : ''}</div></>}
            </div>
            <div style={{ marginTop: 14 }}>
              <span className="lbl">Valid for</span>
              <Seg options={[{ value: 'Day', label: 'Today' }, { value: 'GTC', label: 'Until cancelled' }]} value={validity} onChange={setValidity} ariaLabel="Validity" />
            </div>
            <div style={{ marginTop: 18, padding: 14, background: 'var(--paper)', borderRadius: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>What you'll {side === 'Buy' ? 'pay' : 'receive'}</div>
              <div className="kv"><span className="muted">{n0(u)} units × ₦{n2(px)}</span><span className="num">{naira(cons)}</span></div>
              <div className="kv"><span className="muted">Brokerage commission ({pct(state.settings.commission * 100, 2)})</span><span className="num">{naira(fees.comm)}</span></div>
              <div className="kv"><span className="muted">SEC fee ({pct(state.settings.secFee * 100, 2)})</span><span className="num">{naira(fees.sec)}</span></div>
              <div className="kv"><span className="muted">NGX fee ({pct(state.settings.ngxFee * 100, 2)})</span><span className="num">{naira(fees.ngx)}</span></div>
              <div className="kv"><span className="muted">CSCS fee ({pct(state.settings.cscsFee * 100, 2)})</span><span className="num">{naira(fees.cscs)}</span></div>
              <div className="kv"><span className="muted">Stamp duty ({pct(state.settings.stampDuty * 100, 3)})</span><span className="num">{naira(fees.stamp)}</span></div>
              <div className="kv"><span className="muted">VAT on fees ({pct(state.settings.vat * 100)})</span><span className="num">{naira(fees.vat)}</span></div>
              <div className="kv tot"><span>Total</span><span className="num">{naira(total)}</span></div>
              <div className="muted xs" style={{ marginTop: 6 }}>Charges are {cons > 0 ? pct(fees.total / cons * 100, 2) : '0%'} of the trade. Final figures come from Trust Bank Securities on the contract note.</div>
            </div>
            <div className="small muted" style={{ marginTop: 14 }}>Settled cash available: <strong style={{ color: 'var(--ink)' }}>{naira(state.cash.settled)}</strong>. <Link to="/app/funding">Add money</Link></div>
            {notEnoughCash && <div className="alert bad" style={{ marginTop: 8 }}>Not enough settled cash. Lower the amount or add money first.</div>}
            {notEnoughUnits && <div className="alert bad" style={{ marginTop: 8 }}>You hold {n0(held?.units || 0)} units of {ticker}.</div>}
            <button className="btn btn-p btn-block btn-l" type="button" style={{ marginTop: 14 }} disabled={!canSubmit || !state.settings.flags.trading} onClick={() => setConfirm(true)}>Review {side.toLowerCase()} order</button>
            <div className="muted xs" style={{ marginTop: 10, textAlign: 'center' }}>You'll confirm with your PIN. Orders placed after the close queue for tomorrow's open.</div>
          </div>
        </div>
      </div>
      {confirm && (
        <Modal title={`Confirm ${side.toLowerCase()} order`} onClose={() => setConfirm(false)}>
          <div className="kv"><span className="muted">Security</span><strong>{ticker}</strong></div>
          <div className="kv"><span className="muted">Units</span><strong>{n0(u)}</strong></div>
          <div className="kv"><span className="muted">Order</span><strong>{type}{type === 'Limit' ? ` at ₦${n2(px)}` : ''}, valid {validity === 'Day' ? 'today' : 'until cancelled'}</strong></div>
          <div className="kv tot"><span>{side === 'Buy' ? 'Total you pay' : 'You receive'}</span><strong>{naira(total)}</strong></div>
          <div style={{ marginTop: 16 }}><label className="lbl" htmlFor="pin">Transaction PIN</label><input id="pin" className="inp" type="password" inputMode="numeric" maxLength="4" value={pin} onChange={e => setPin(e.target.value)} placeholder="••••" style={{ letterSpacing: '.3em', maxWidth: 160 }} /></div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}><button className="btn btn-o" type="button" onClick={() => setConfirm(false)}>Back</button><button className="btn btn-p" type="button" onClick={place}>Place order</button></div>
          <div className="muted xs" style={{ marginTop: 10 }}>Demo: any 4 digits work as the PIN.</div>
        </Modal>
      )}
    </>
  )
}
