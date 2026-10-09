import React, { useState } from 'react'
import { useStore } from '../store/store.jsx'
import { computeFees, naira, pct } from '../utils.js'

export default function FeeCalc() {
  const { state } = useStore()
  const s = state.settings
  const [side, setSide] = useState('buy')
  const [v, setV] = useState(100000)
  const f = computeFees(v, s)
  return (
    <div className="calc" id="calc">
      <span className="lbl" id="calclab">See the full cost of a trade</span>
      <div className="seg" role="group" aria-labelledby="calclab"><button type="button" className={side === 'buy' ? 'on' : ''} onClick={() => setSide('buy')}>Buy</button><button type="button" className={side === 'sell' ? 'on' : ''} onClick={() => setSide('sell')}>Sell</button></div>
      <label className="lbl" htmlFor="calcamt" style={{ marginTop: 16 }}>Amount in naira</label>
      <input id="calcamt" className="inp" type="text" inputMode="numeric" value={v.toLocaleString('en-NG')} onChange={e => setV(parseInt(e.target.value.replace(/[^0-9]/g, '') || '0', 10))} />
      <div style={{ marginTop: 18 }} aria-live="polite">
        {[['Brokerage commission', s.commission, f.comm], ['SEC fee', s.secFee, f.sec], ['NGX fee', s.ngxFee, f.ngx], ['CSCS fee', s.cscsFee, f.cscs], ['Stamp duty', s.stampDuty, f.stamp]].map(([l, r, a]) => <div className="ln" key={l}><span>{l} ({pct(r * 100, 3).replace(/\.?0+%$/, '%')})</span><span className="num">{naira(a)}</span></div>)}
        <div className="ln"><span>VAT on fees (7.5%)</span><span className="num">{naira(f.vat)}</span></div>
        <div className="ln tot"><span>{side === 'buy' ? 'Total you pay' : 'You receive'}</span><span className="num">{naira(side === 'buy' ? v + f.total : v - f.total)}</span></div>
      </div>
      <p className="note">Sample rates for illustration. Final charges come from our sponsoring broker on your contract note.</p>
    </div>
  )
}
