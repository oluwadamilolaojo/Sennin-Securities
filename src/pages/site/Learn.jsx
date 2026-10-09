import React, { useState } from 'react'
import { STOCKS, BOND_WINDOW, LEARN } from '../../data/mock.js'
import { n2, naira, fmtDate } from '../../utils.js'

export default function Learn() {
  const [amt, setAmt] = useState(100000)
  const [t, setT] = useState(3)
  const cal = STOCKS.filter(s => s.nextDiv).map(s => ({ ...s.nextDiv, ticker: s.ticker, name: s.name })).sort((a, b) => a.pay.localeCompare(b.pay))
  return (
    <>
      <div className="wrap page-hero"><h1>Free tools and plain guides.</h1><p>Useful whether or not you ever open an account.</p></div>
      <section className="block alt" id="calendar"><div className="wrap">
        <div className="sechead"><h2>Nigerian dividend calendar</h2><p>Every declared dividend on the NGX, with the date you must own the shares by and the date it pays. Sample data shown.</p></div>
        <div className="tablebox" style={{ marginTop: 36 }}><table className="ptable"><thead><tr><th>Company</th><th>Dividend</th><th>Per unit</th><th>Qualification</th><th>Payment</th></tr></thead><tbody>{cal.map(d => <tr key={d.ticker}><td>{d.ticker}<div className="muted small">{d.name}</div></td><td>{d.type}</td><td>₦{n2(d.amount)}</td><td>{fmtDate(d.qual)}</td><td>{fmtDate(d.pay)}</td></tr>)}</tbody></table></div>
      </div></section>
      <section className="block" id="bond"><div className="wrap">
        <div className="pricing" style={{ marginTop: 0 }}>
          <div><div className="sechead"><h2>FGN Savings Bond calculator</h2><p>{BOND_WINDOW.month} window: {BOND_WINDOW.rates[2]}% for 2 years, {BOND_WINDOW.rates[3]}% for 3 years. Interest every quarter, tax free, from ₦5,000.</p></div><div className="card" style={{ marginTop: 24 }}><label className="lbl" htmlFor="amt" style={{ fontSize: 15, color: 'var(--text)', fontWeight: 600 }}>Amount</label><input id="amt" className="inp" type="number" step="1000" value={amt} onChange={e => setAmt(Number(e.target.value))} /><div style={{ marginTop: 12 }}><span className="lbl">Tenor</span><div className="seg">{[2, 3].map(x => <button key={x} type="button" className={t === x ? 'on' : ''} onClick={() => setT(x)}>{x} years</button>)}</div></div></div></div>
          <div className="calc"><span className="lbl">What you'd receive</span><div className="ln"><span>Every quarter</span><span className="num">{naira(amt * BOND_WINDOW.rates[t] / 100 / 4)}</span></div><div className="ln"><span>Each year</span><span className="num">{naira(amt * BOND_WINDOW.rates[t] / 100)}</span></div><div className="ln"><span>Total interest over {t} years</span><span className="num">{naira(amt * BOND_WINDOW.rates[t] / 100 * t)}</span></div><div className="ln tot"><span>Back at maturity</span><span className="num">{naira(amt)}</span></div><p className="note">Rates are set by the DMO each month.</p></div>
        </div>
      </div></section>
      <section className="block alt"><div className="wrap">
        <div className="sechead"><h2>Guides</h2></div>
        <div className="grid g2" style={{ marginTop: 36 }}>{LEARN.map(a => <div className="card" key={a.slug} id={a.slug}><div className="muted small">{a.mins} min read</div><h3 style={{ fontSize: 21, marginTop: 6 }}>{a.title}</h3><p className="muted" style={{ marginTop: 10, lineHeight: 1.65 }}>{a.body}</p></div>)}</div>
      </div></section>
    </>
  )
}
