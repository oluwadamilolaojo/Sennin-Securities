import React from 'react'
import { TopBar } from '../../layouts/Shell.jsx'
import { useStore, stockOf } from '../../store/store.jsx'
import { LiquidityPill } from '../../components/ui.jsx'
import { STOCKS, LEARN } from '../../data/mock.js'

export default function LendLearn() {
  const { state } = useStore()
  const s = state.settings
  return (
    <>
      <TopBar title="How share-backed loans work" plain />
      <div className="content">
        <div className="grid g2" style={{ alignItems: 'start' }}>
          <div className="stack">
            {LEARN.filter(a => ['margin-call', 'chn'].includes(a.slug)).map(a => <div className="card" key={a.slug}><h2 style={{ fontSize: 18 }}>{a.title}</h2><p className="muted" style={{ marginTop: 8, lineHeight: 1.6 }}>{a.body}</p></div>)}
            <div className="card"><h2 style={{ fontSize: 18 }}>What a non-purpose loan means</h2><p className="muted" style={{ marginTop: 8, lineHeight: 1.6 }}>The money can be used for anything except buying shares, bonds or other securities. Borrowing to buy shares is margin trading, which sits under different rules and a different licence. That's why every application asks what the money is for.</p></div>
          </div>
          <div className="card tight"><div className="card-head"><h2>Eligible securities and advance rates</h2></div><div className="scroll"><table className="tbl"><thead><tr><th>Security</th><th>Liquidity</th><th className="num">Advance rate</th></tr></thead><tbody>
            {STOCKS.map(st => <tr key={st.ticker}><td><strong>{st.ticker}</strong><div className="muted xs">{st.name}</div></td><td><LiquidityPill level={st.liquidity} /></td><td className="num">{Math.round((s.advance[st.ticker] ?? st.advance) * 100)}%{st.bank ? <div className="muted xs">non-purpose loans only</div> : null}</td></tr>)}
          </tbody></table></div><div className="card-foot muted">Rates can change with liquidity. We give 5 working days' notice before lowering one on an open loan.</div></div>
        </div>
      </div>
    </>
  )
}
