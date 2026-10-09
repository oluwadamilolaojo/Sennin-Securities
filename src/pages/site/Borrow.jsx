import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Pill, LiquidityPill } from '../../components/ui.jsx'
import { useStore } from '../../store/store.jsx'
import { STOCKS, LEARN } from '../../data/mock.js'
import { naira, pct, amortise } from '../../utils.js'
import Waitlist from './Waitlist.jsx'

export default function Borrow() {
  const { state } = useStore()
  const s = state.settings
  const [v, setV] = useState(2000000)
  const [m, setM] = useState(6)
  const maxLoan = v * 0.5
  const rows = amortise(maxLoan, s.loanRate, m)
  const interest = rows.reduce((a, r) => a + r.interest, 0)
  return (
    <>
      <div className="wrap page-hero"><Pill>Opens March 2027</Pill><h1 style={{ marginTop: 12 }}>Borrow against your shares. Keep the shares, keep the dividends.</h1><p>A loan from Trust Bank, arranged by Vendii, secured on NGX shares you hold with us or any other broker. No salary slip, no guarantor, no early repayment charge.</p><div style={{ display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap' }}><Link className="btn btn-p btn-l" to="/signup">Join the waitlist</Link><Link className="btn btn-l" to="/lend" style={{ border: '1.5px solid var(--line)', color: 'var(--text)' }}>Try the demo</Link></div></div>
      <section className="block alt"><div className="wrap">
        <div className="pricing" style={{ marginTop: 0 }}>
          <div>
            <div className="sechead"><h2>Roughly what you could borrow</h2><p>Advance rates run from 30% to 55% of a stock's value, depending on how easily it trades. The calculator assumes 50%.</p></div>
            <div className="card" style={{ marginTop: 24 }}>
              <label className="lbl" htmlFor="pv" style={{ fontSize: 15, color: 'var(--text)', fontWeight: 600 }}>Value of your eligible shares</label>
              <div style={{ fontSize: 34, fontWeight: 700 }} className="num">{naira(v)}</div>
              <input id="pv" type="range" min="200000" max="50000000" step="100000" value={v} onChange={e => setV(Number(e.target.value))} />
              <div style={{ marginTop: 14 }}><span className="lbl">Tenor</span><div className="seg">{[3, 6, 9, 12].map(t => <button key={t} type="button" className={m === t ? 'on' : ''} onClick={() => setM(t)}>{t} months</button>)}</div></div>
            </div>
          </div>
          <div className="calc">
            <span className="lbl">Your loan, all in (sample pricing)</span>
            <div style={{ fontSize: 34, fontWeight: 700, marginTop: 6 }} className="num">{naira(maxLoan)}</div>
            <div className="ln"><span>Interest rate</span><span>{Math.round(s.loanRate * 100)}% a year</span></div>
            <div className="ln"><span>Monthly payment</span><span className="num">{naira(rows[0].payment)}</span></div>
            <div className="ln"><span>Total interest</span><span className="num">{naira(interest)}</span></div>
            <div className="ln"><span>Arrangement fee ({Math.round(s.arrangementFee * 100)}%) and lien fee</span><span className="num">{naira(maxLoan * s.arrangementFee + s.lienFee)}</span></div>
            <div className="ln tot"><span>Total you repay</span><span className="num">{naira(maxLoan + interest + maxLoan * s.arrangementFee + s.lienFee)}</span></div>
            <p className="note">We ask you to add cover if the loan reaches {pct(s.callLtv * 100)} of your shares' value, and give you {s.cureDays} working days.</p>
          </div>
        </div>
      </div></section>
      <section className="block"><div className="wrap">
        <div className="sechead"><h2>Eligible securities and advance rates</h2><p>Published, so nobody is surprised at application. Bank shares are eligible for non-purpose loans.</p></div>
        <div className="tablebox" style={{ marginTop: 36 }}><table className="ptable"><thead><tr><th>Security</th><th>Liquidity</th><th>Advance rate</th></tr></thead><tbody>{STOCKS.map(st => <tr key={st.ticker}><td>{st.ticker}<div className="muted small">{st.name}</div></td><td><LiquidityPill level={st.liquidity} /></td><td>{Math.round((s.advance[st.ticker] ?? st.advance) * 100)}%</td></tr>)}</tbody></table></div>
      </div></section>
      <section className="block alt"><div className="wrap"><div className="sechead"><h2>{LEARN[3].title}</h2><p>{LEARN[3].body}</p></div></div></section>
      <section className="block" id="partners"><div className="wrap"><div className="sechead"><h2>For banks and brokers</h2><p>Vendii originates and services; a partner bank lends and holds the lien. Brokers can offer Vendii loans to their own clients through an embedded API (Phase 3). <a href="mailto:[partnerships email]">Talk to us</a>.</p></div></div></section>
      <Waitlist />
    </>
  )
}
