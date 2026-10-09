import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TopBar } from '../../layouts/Shell.jsx'
import { useStore, eligibleCollateral } from '../../store/store.jsx'
import { Pill, Seg, HealthBar } from '../../components/ui.jsx'
import { naira, n0, pct, amortise } from '../../utils.js'

export default function Build() {
  const { state, dispatch, toast } = useStore()
  const nav = useNavigate()
  const s = state.settings
  const all = eligibleCollateral(state).filter(r => r.advance > 0)
  const d = state.draftLoan
  const [sel, setSel] = useState(d?.sel || all.slice(0, 3).map(r => r.ticker))
  const [amount, setAmount] = useState(d?.amount || 900000)
  const [tenor, setTenor] = useState(d?.tenor || 6)
  const [plan, setPlan] = useState(d?.plan || 'Monthly')
  const [purpose, setPurpose] = useState(d?.purpose || 'Personal')
  const [declared, setDeclared] = useState(!!d)
  const chosen = all.filter(r => sel.includes(r.ticker))
  const coll = chosen.reduce((a, r) => a + r.value, 0)
  const maxLoan = Math.max(100000, Math.floor(chosen.reduce((a, r) => a + r.borrowable, 0) / 10000) * 10000)
  const amt = Math.min(Number(amount) || 100000, maxLoan)
  const big = chosen.reduce((m, r) => (!m || r.value > m.value ? r : m), null)
  const share = big && coll > 0 ? big.value / coll : 0
  const concWarn = share > s.maxConcentration && chosen.length > 0
  const r = s.loanRate / 12
  const rows = useMemo(() => amortise(amt, s.loanRate, tenor), [amt, s.loanRate, tenor])
  const bullet = plan === 'Interest only'
  const interest = bullet ? amt * r * tenor : rows.reduce((a, x) => a + x.interest, 0)
  const fee = amt * s.arrangementFee, lien = s.lienFee
  const total = amt + interest + fee + lien
  const apr = (interest + fee + lien) / amt / (tenor / 12) * 100
  const ltv = coll > 0 ? amt / coll : 0
  const callVal = amt / s.callLtv, liqVal = amt / s.liqLtv
  const fall = coll > 0 ? Math.max(0, 1 - callVal / coll) * 100 : 0
  const liqFall = coll > 0 ? Math.max(0, 1 - liqVal / coll) * 100 : 0
  const cure = Math.max(0, amt - callVal * s.warnLtv)
  const canContinue = chosen.length > 0 && declared && !concWarn && ltv < s.warnLtv
  function toggle(t) { const n = sel.includes(t) ? sel.filter(x => x !== t) : [...sel, t]; if (n.length) setSel(n) }
  function next() {
    dispatch({ type: 'SET_DRAFT_LOAN', draft: { sel, amount: amt, tenor, plan, purpose, collateral: chosen.map(c => ({ ticker: c.ticker, units: c.units })), interest, fee, lien, total, apr, coll, payment: bullet ? amt * r : rows[0]?.payment } })
    nav('/lend/review')
  }
  return (
    <>
      <TopBar title="Build your loan" plain><Pill kind="good">Draft saved</Pill><span className="muted small">Step 1 of 2</span></TopBar>
      <div className="content">
        <div className="grid g3" style={{ alignItems: 'start' }}>
          <div className="span2 stack">
            <div className="card">
              <div className="row"><h2 style={{ fontSize: 17 }}>1. Which shares back the loan?</h2><span className="muted small">Pick any mix. Unpicked shares stay free to sell.</span></div>
              <div className="grid g2" style={{ gap: 10, marginTop: 14 }}>
                {all.map(c => <button key={c.ticker} type="button" className={'opt' + (sel.includes(c.ticker) ? ' on' : '')} onClick={() => toggle(c.ticker)} style={{ display: 'flex', alignItems: 'center', gap: 14 }}><span style={{ width: 20, height: 20, borderRadius: 5, border: '2px solid ' + (sel.includes(c.ticker) ? 'var(--ink)' : 'var(--muted)'), background: sel.includes(c.ticker) ? 'var(--ink)' : '#fff', color: '#fff', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{sel.includes(c.ticker) ? '✓' : ''}</span><span style={{ flex: 1 }}><div style={{ fontWeight: 600 }}>{c.ticker} <span className="muted" style={{ fontWeight: 400 }}>{n0(c.units)} units</span></div><div className="muted xs">{naira(c.value)} · {Math.round(c.advance * 100)}% advance · {c.liquidity}</div></span><span className="num small">up to {naira(c.borrowable)}</span></button>)}
              </div>
              {concWarn && <div className="alert warn" style={{ marginTop: 12 }}>{big.ticker} is {Math.round(share * 100)}% of your collateral. No single stock may back more than {Math.round(s.maxConcentration * 100)}% of the loan, so add another stock or lower the amount.</div>}
            </div>
            <div className="card">
              <h2 style={{ fontSize: 17 }}>2. How much, and for how long?</h2>
              <div style={{ marginTop: 14 }}>
                <div className="row"><label className="lbl" htmlFor="amt">Loan amount</label><span className="muted xs">Max {naira(maxLoan)} with the shares you picked</span></div>
                <div style={{ fontSize: 34, fontWeight: 700 }} className="num">{naira(amt)}</div>
                <input id="amt" type="range" min="100000" max={maxLoan} step="10000" value={amt} onChange={e => setAmount(Number(e.target.value))} />
                <div className="row muted xs"><span>₦100,000</span><span>{naira(maxLoan)}</span></div>
              </div>
              <div className="grid g2" style={{ marginTop: 18 }}>
                <div><span className="lbl">Tenor</span><Seg options={[3, 6, 9, 12].map(m => ({ value: m, label: m + ' months' }))} value={tenor} onChange={setTenor} ariaLabel="Tenor" /></div>
                <div><span className="lbl">How you repay</span><Seg options={[{ value: 'Monthly', label: 'Monthly, equal payments' }, { value: 'Interest only', label: 'Interest monthly, principal at the end' }]} value={plan} onChange={setPlan} ariaLabel="Repayment" /></div>
              </div>
              <div className="rowline" style={{ marginTop: 12 }}><span className="small">A credit line you draw from as you need it</span><Pill>Phase 2</Pill></div>
            </div>
            <div className="card">
              <h2 style={{ fontSize: 17 }}>3. What is the money for?</h2>
              <p className="muted small" style={{ marginTop: 4 }}>Required by the bank. This loan can't be used to buy shares or other securities.</p>
              <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
                {[['Personal', 'Personal: school fees, rent, medical, family'], ['Business', 'Business: working capital, stock, equipment'], ['Property', 'Property or a large purchase']].map(([v, l]) => <button key={v} type="button" className={'opt' + (purpose === v ? ' on' : '')} onClick={() => setPurpose(v)}>{l}</button>)}
              </div>
              <label className="chk" style={{ marginTop: 14 }}><input type="checkbox" checked={declared} onChange={e => setDeclared(e.target.checked)} /><span>I confirm I won't use this loan to buy shares, bonds or other securities, or to repay another loan secured on securities.</span></label>
            </div>
          </div>
          <div className="stack">
            <div className="card ink">
              <div style={{ color: 'var(--gold)', fontWeight: 600, fontSize: 13 }}>Your loan, all in</div>
              <div style={{ fontSize: 34, fontWeight: 700, marginTop: 4 }} className="num">{naira(amt)}</div>
              <div className="muted small">for {tenor} months at {Math.round(s.loanRate * 100)}% a year</div>
              <div style={{ marginTop: 14, borderTop: '1px solid #2F5F8A', paddingTop: 12 }}>
                <div className="kv"><span className="muted">{bullet ? 'Monthly interest' : 'Monthly payment'}</span><strong className="num">{naira(bullet ? amt * r : rows[0]?.payment || 0)}</strong></div>
                {bullet && <div className="kv"><span className="muted">Final payment (month {tenor})</span><span className="num">{naira(amt + amt * r)}</span></div>}
                <div className="kv"><span className="muted">Total interest</span><span className="num">{naira(interest)}</span></div>
                <div className="kv"><span className="muted">Arrangement fee ({pct(s.arrangementFee * 100, 0)})</span><span className="num">{naira(fee)}</span></div>
                <div className="kv"><span className="muted">CSCS lien fee</span><span className="num">{naira(lien)}</span></div>
                <div className="kv tot" style={{ borderColor: '#2F5F8A' }}><span>Total you repay</span><span className="num">{naira(total)}</span></div>
                <div className="kv"><span className="muted">Effective annual cost (APR)</span><span className="num">{pct(apr)}</span></div>
                <div className="kv"><span className="muted">Early repayment</span><span>Free, any day</span></div>
              </div>
              <div className="muted xs" style={{ marginTop: 10 }}>Sample pricing. Final terms come from Trust Bank on the key facts sheet.</div>
            </div>
            <div className="card">
              <div className="row"><h2 style={{ fontSize: 15 }}>Loan health at the start</h2><strong className="num">LTV {pct(ltv * 100)}</strong></div>
              <div style={{ marginTop: 10 }}><HealthBar ltv={ltv} settings={s} color="var(--ink)" /></div>
              {ltv >= s.warnLtv && <div className="alert warn" style={{ marginTop: 10 }}>This would start in the warning zone. Lower the amount or add shares.</div>}
              <p className="small" style={{ marginTop: 14, lineHeight: 1.6 }}><strong>Worked example.</strong> Your pledged shares are worth {naira(coll)} today. If they fall <strong>{fall.toFixed(0)}%</strong> to {naira(callVal)}, we ask you to add about <strong>{naira(cure)}</strong> in cash or shares within {s.cureDays} working days. If they fall {liqFall.toFixed(0)}% and nothing is added, enough shares are sold to bring the loan back to a safe level, and you keep the rest.</p>
            </div>
            <button className="btn btn-g btn-block btn-l" type="button" disabled={!canContinue} onClick={next}>Continue to review and sign</button>
            {!declared && chosen.length > 0 && <div className="muted xs" style={{ textAlign: 'center' }}>Tick the declaration in step 3 to continue.</div>}
          </div>
        </div>
      </div>
    </>
  )
}
