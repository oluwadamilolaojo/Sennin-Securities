import React, { useState } from 'react'
import { TopBar } from '../../layouts/Shell.jsx'
import { useStore, loanMetrics, stockOf } from '../../store/store.jsx'
import { Pill, statusPill, Stat, Tabs, LiquidityPill } from '../../components/ui.jsx'
import { naira, n0, pct, fmtDate } from '../../utils.js'
import { STOCKS } from '../../data/mock.js'

export default function Lending() {
  const { state, dispatch, toast } = useStore()
  const [tab, setTab] = useState('calls')
  const s = state.settings
  const active = state.loans.filter(l => l.status === 'Active').map(l => ({ l, m: loanMetrics(l, state) }))
  const pending = state.loans.filter(l => l.status === 'Pending approval')
  const book = active.reduce((a, x) => a + x.l.outstanding, 0)
  const coll = active.reduce((a, x) => a + x.m.collateral, 0)
  const calls = active.filter(x => x.m.band === 'call' || x.m.band === 'liquidation')
  const warns = active.filter(x => x.m.band === 'warning')
  const bands = { healthy: active.filter(x => x.m.ltv < 0.3).length, mid: active.filter(x => x.m.ltv >= 0.3 && x.m.ltv < 0.45).length, upper: active.filter(x => x.m.ltv >= 0.45 && x.m.band === 'healthy').length, warning: warns.length, call: calls.length }
  const exposure = STOCKS.map(st => { const v = active.reduce((a, x) => a + x.m.rows.filter(r => r.ticker === st.ticker).reduce((b, r) => b + r.value, 0), 0); return { st, v, share: coll ? v / coll : 0, loans: active.filter(x => x.m.rows.some(r => r.ticker === st.ticker)).length } }).filter(e => e.v > 0).sort((a, b) => b.v - a.v)
  return (
    <>
      <TopBar title="Share-backed lending book" plain><span className="muted small">Lender: Trust Bank · revalued daily at the NGX close</span></TopBar>
      <div className="content">
        <div className="grid g4">
          <Stat label="Outstanding" value={naira(book)} sub={`${active.length} loans`} />
          <Stat label="Collateral held" value={naira(coll)} sub={`weighted LTV ${coll ? pct(book / coll * 100) : '0%'}`} />
          <Stat label="In warning / in call" value={`${warns.length} / ${calls.length}`} sub={calls.length ? 'all contacted' : 'none today'} />
          <Stat label="Book vs programme limit" value={pct(book / s.programmeLimit * 100, 2)} sub={`of ${naira(s.programmeLimit)}`} />
        </div>
        <div className="card tight">
          <Tabs tabs={[{ value: 'calls', label: `Margin call queue (${calls.length + warns.length})` }, { value: 'pending', label: `Applications (${pending.length})` }, { value: 'book', label: 'All loans' }, { value: 'exposure', label: 'Exposure and caps' }, { value: 'rates', label: 'Advance rates' }]} value={tab} onChange={setTab} />
          {tab === 'calls' && (
            <>
              <div className="scroll"><table className="tbl"><thead><tr><th>Loan</th><th>Borrower</th><th className="num">Outstanding</th><th className="num">LTV</th><th className="num">Cover needed</th><th>Deadline</th><th>Contact</th><th>Status</th><th></th></tr></thead><tbody>
                {[...calls, ...warns].map(({ l, m }) => <tr key={l.id}><td><strong>{l.id}</strong></td><td>{l.ownerName}</td><td className="num">{naira(l.outstanding)}</td><td className={'num ' + (m.band === 'warning' ? 'warn' : 'dn')} style={{ fontWeight: 600, color: m.band === 'warning' ? 'var(--warn)' : undefined }}>{pct(m.ltv * 100)}</td><td className="num">{naira(m.cureNeeded)}</td><td>{m.band === 'warning' ? 'n/a (warning)' : `${s.cureDays} working days`}</td><td className="muted small">SMS, WhatsApp, email{m.band !== 'warning' ? ', call' : ''}</td><td>{m.band === 'warning' ? <Pill kind="warn">Warned</Pill> : <Pill kind="bad">Awaiting borrower</Pill>}</td><td style={{ whiteSpace: 'nowrap' }}>{m.band !== 'warning' && <><button className="btn btn-o btn-s" type="button" onClick={() => toast('Sale held for 24 hours; logged')}>Hold sale</button> <button className="btn btn-d btn-s" type="button" onClick={() => { const r = m.rows.filter(x => x.liquidity === 'High')[0] || m.rows[0]; const u = Math.min(r.units, Math.ceil(m.cureNeeded * 1.6 / r.price)); dispatch({ type: 'LIQUIDATE', id: l.id, ticker: r.ticker, units: u, proceeds: Math.round(u * r.price * 0.98) }); toast('Sale instructed to broker; borrower notified') }}>Sell to restore</button></>}</td></tr>)}
                {!calls.length && !warns.length && <tr><td colSpan="9" className="muted" style={{ textAlign: 'center', padding: 24 }}>No loans in warning or call. Try the market shock in Fees, rates and flags to see the queue fill.</td></tr>}
              </tbody></table></div>
              <div className="card-foot muted">Auto-sell runs at each deadline unless a credit officer holds it. Every message to the borrower is logged on the loan.</div>
            </>
          )}
          {tab === 'pending' && (
            <div className="scroll"><table className="tbl"><thead><tr><th>Loan</th><th>Borrower</th><th className="num">Amount</th><th>Tenor</th><th>Purpose</th><th>Collateral</th><th className="num">Starting LTV</th><th>Bureau</th><th></th></tr></thead><tbody>
              {pending.map(l => { const m = loanMetrics(l, state); return <tr key={l.id}><td><strong>{l.id}</strong></td><td>{l.ownerName}</td><td className="num">{naira(l.amount)}</td><td>{l.tenor} months · {l.plan}</td><td>{l.purpose}</td><td className="small">{l.collateral.map(c => `${c.ticker} ${n0(c.units)}`).join(', ')}</td><td className="num">{pct(m.ltv * 100)}</td><td><Pill kind="good">Clear (sample)</Pill></td><td style={{ whiteSpace: 'nowrap' }}><button className="btn btn-p btn-s" type="button" onClick={() => { dispatch({ type: 'APPROVE_LOAN', id: l.id }); toast('Approved; lien placed; payout instructed') }}>Approve and pay</button> <button className="linkbtn" type="button" onClick={() => { dispatch({ type: 'DECLINE_LOAN', id: l.id }); toast('Declined; borrower notified') }}>Decline</button></td></tr> })}
              {!pending.length && <tr><td colSpan="9" className="muted" style={{ textAlign: 'center', padding: 24 }}>No applications waiting.</td></tr>}
            </tbody></table></div>
          )}
          {tab === 'book' && (
            <div className="scroll"><table className="tbl"><thead><tr><th>Loan</th><th>Borrower</th><th>Status</th><th className="num">Amount</th><th className="num">Outstanding</th><th className="num">LTV</th><th>Started</th><th>Plan</th></tr></thead><tbody>
              {state.loans.map(l => { const m = loanMetrics(l, state); return <tr key={l.id}><td><strong>{l.id}</strong></td><td>{l.ownerName}</td><td>{statusPill(l.status)}</td><td className="num">{naira(l.amount)}</td><td className="num">{naira(l.outstanding)}</td><td className="num">{pct(m.ltv * 100)}</td><td>{l.start ? fmtDate(l.start) : '—'}</td><td>{l.tenor} months · {l.plan}</td></tr> })}
            </tbody></table></div>
          )}
          {tab === 'exposure' && (
            <>
              <div style={{ padding: '14px 20px 0' }} className="muted small">Cap per security: {Math.round(s.maxStockShareOfBook * 100)}% of collateral book · per loan: {Math.round(s.maxConcentration * 100)}% from one stock · bank shares: non-purpose loans only</div>
              <div className="scroll"><table className="tbl"><thead><tr><th>Security</th><th className="num">Collateral value</th><th className="num">Share of book</th><th>Against cap</th><th className="num">Advance rate</th><th>Liquidity</th><th className="num">Loans</th></tr></thead><tbody>
                {exposure.map(e => <tr key={e.st.ticker}><td><strong>{e.st.ticker}</strong></td><td className="num">{naira(e.v)}</td><td className="num">{pct(e.share * 100)}</td><td><div className="hbar" style={{ height: 8, minWidth: 90 }}><i className="fill" style={{ width: Math.min(100, e.share / s.maxStockShareOfBook * 100) + '%', background: e.share > s.maxStockShareOfBook * 0.85 ? 'var(--warn)' : 'var(--blue)' }} /></div></td><td className="num">{Math.round((s.advance[e.st.ticker] ?? e.st.advance) * 100)}%</td><td><LiquidityPill level={e.st.liquidity} /></td><td className="num">{e.loans}</td></tr>)}
              </tbody></table></div>
              <div className="card-foot muted">Non-purpose book, so the 2010 margin lending rules (10% of total loans, 120% maintenance margin) are tracked for reference and not binding. Status of the SEC/CBN revision to be confirmed.</div>
            </>
          )}
          {tab === 'rates' && (
            <div className="scroll"><table className="tbl"><thead><tr><th>Security</th><th>Liquidity</th><th className="num">Avg daily value</th><th className="num">Advance rate</th><th></th></tr></thead><tbody>
              {STOCKS.map(st => { const cur = s.advance[st.ticker] ?? st.advance; return <tr key={st.ticker}><td><strong>{st.ticker}</strong><div className="muted xs">{st.name}</div></td><td><LiquidityPill level={st.liquidity} /></td><td className="num">₦{(st.avgValue / 1e6).toFixed(0)}m</td><td className="num"><input type="range" min="0" max="0.7" step="0.05" value={cur} onChange={e => dispatch({ type: 'ADVANCE_RATE', ticker: st.ticker, rate: Number(e.target.value) })} aria-label={`Advance rate ${st.ticker}`} style={{ width: 140 }} /> <strong>{Math.round(cur * 100)}%</strong></td><td className="muted xs">{cur === 0 ? 'Not eligible' : st.bank ? 'non-purpose only' : ''}</td></tr> })}
            </tbody></table></div>
          )}
        </div>
        <div className="grid g2">
          <div className="card"><h2 style={{ fontSize: 17 }}>LTV distribution</h2><div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 140, marginTop: 16 }}>{[['under 30%', bands.healthy, 'var(--good)'], ['30 to 45', bands.mid, 'var(--good)'], ['45 to warn', bands.upper, '#5AC48A'], ['warning', bands.warning, 'var(--warn)'], ['call', bands.call, 'var(--bad)']].map(([l, v, c]) => <div key={l} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: 6, height: '100%' }}><span className="small" style={{ fontWeight: 600 }}>{v}</span><div style={{ width: '100%', height: Math.max(4, v / Math.max(1, active.length) * 100) + '%', background: c, borderRadius: '6px 6px 0 0' }} /><span className="muted xs">{l}</span></div>)}</div></div>
          <div className="card"><h2 style={{ fontSize: 17 }}>Market stress controls</h2><div className="stack" style={{ gap: 8, marginTop: 12 }}><div className="rowline"><span>Pause new loans</span><button type="button" className={'sw' + (!s.flags.lending ? ' on' : '')} onClick={() => dispatch({ type: 'FLAG', key: 'lending', value: !s.flags.lending })} aria-label="Pause new loans"><span /></button></div><div className="rowline"><span>Simulated market fall (demo)</span><span><input type="range" min="0" max="0.7" step="0.01" value={s.marketShock} onChange={e => dispatch({ type: 'SETTINGS', patch: { marketShock: Number(e.target.value) } })} aria-label="Market shock" style={{ width: 160 }} /> <strong>{Math.round(s.marketShock * 100)}%</strong></span></div></div><div className="muted xs" style={{ marginTop: 10 }}>Auto-triggers a pause if the NGX All-Share falls more than 5% in a day (Phase 2).</div></div>
        </div>
      </div>
    </>
  )
}
