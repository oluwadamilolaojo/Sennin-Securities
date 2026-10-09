import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { TopBar } from '../../layouts/Shell.jsx'
import { useStore, eligibleCollateral, activeLoan } from '../../store/store.jsx'
import { Pill, LiquidityPill } from '../../components/ui.jsx'
import { naira, n0, n2, pct } from '../../utils.js'

export default function Start() {
  const { state, toast } = useStore()
  const [src, setSrc] = useState('vendii')
  const [chn, setChn] = useState('')
  const rows = eligibleCollateral(state)
  const eligible = rows.filter(r => r.advance > 0)
  const maxLoan = Math.floor(eligible.reduce((s, r) => s + r.borrowable, 0) / 1000) * 1000
  const eligibleValue = eligible.reduce((s, r) => s + r.value, 0)
  const loan = activeLoan(state)
  const s = state.settings
  return (
    <>
      <TopBar title="Borrow against your shares, without selling them" plain><span className="muted small">Checking your limit doesn't touch your credit file</span></TopBar>
      <div className="content">
        {loan && <div className="alert info row"><span>You already have a loan ({loan.id}, {loan.status.toLowerCase()}). You can top up once it's active and your shares allow it.</span><Link to="/lend" className="btn btn-o btn-s">Open my loan</Link></div>}
        {!s.flags.lending && <div className="alert warn">New loans are paused right now. Existing loans are unaffected.</div>}
        <div className="grid g3" style={{ alignItems: 'start' }}>
          <div className="span2 stack">
            <div className="card">
              <h2 style={{ fontSize: 17 }}>Where are your shares?</h2>
              <div style={{ display: 'flex', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
                <button type="button" className={'opt' + (src === 'vendii' ? ' on' : '')} onClick={() => setSrc('vendii')}><div style={{ fontWeight: 600 }}>In my Vendii account</div><div className="muted small" style={{ marginTop: 4 }}>CHN {state.user.chn} · {state.holdings.length} holdings · we already know them</div></button>
                <button type="button" className={'opt' + (src === 'other' ? ' on' : '')} onClick={() => setSrc('other')}><div style={{ fontWeight: 600, display: 'flex', gap: 8, alignItems: 'center' }}>With another broker <Pill kind="gold">Only on Vendii</Pill></div><div className="muted small" style={{ marginTop: 4 }}>Any CSCS account. Enter your CHN; CSCS sends you a code to confirm.</div></button>
                <button type="button" className="opt" disabled><div style={{ fontWeight: 600, display: 'flex', gap: 8, alignItems: 'center' }}>Old share certificates <Pill>Phase 3</Pill></div><div className="muted small" style={{ marginTop: 4 }}>We move them into CSCS first, then you can borrow against them.</div></button>
              </div>
              {src === 'other' && (
                <div style={{ marginTop: 16 }}>
                  <div className="grid g2" style={{ alignItems: 'end' }}><div><label className="lbl" htmlFor="chn">Your CHN at the other broker</label><input id="chn" className="inp" value={chn} onChange={e => setChn(e.target.value)} placeholder="e.g. 1845023" /></div><button className="btn btn-p" type="button" onClick={() => toast(chn.length >= 6 ? 'CSCS sent a code to your phone. Holdings import after you confirm.' : 'Enter a valid CHN', chn.length >= 6 ? 'good' : 'bad')}>Send CSCS code</button></div>
                  <div className="muted xs" style={{ marginTop: 8 }}>We read your holdings only. Nothing moves and your broker relationship doesn't change. Cross-broker lien mechanics are being confirmed with CSCS.</div>
                </div>
              )}
            </div>
            <div className="card tight">
              <div className="card-head" style={{ alignItems: 'flex-start' }}><div><h2>Your eligible shares</h2><div className="muted small" style={{ marginTop: 4 }}>Each stock has an advance rate: how much of its value you can borrow. Liquid, large companies get more. We value shares at the lower of today's price and the recent average, so a one-day spike doesn't inflate your limit.</div></div><Link to="/lend/learn" className="small" style={{ whiteSpace: 'nowrap' }}>Full eligible list</Link></div>
              <div className="scroll"><table className="tbl"><thead><tr><th>Security</th><th className="num">Units</th><th className="num">Valuation used</th><th>Liquidity</th><th className="num">Advance rate</th><th className="num">You can borrow</th></tr></thead><tbody>
                {rows.sort((a, b) => b.borrowable - a.borrowable).map(r => <tr key={r.ticker} style={{ color: r.advance > 0 ? undefined : 'var(--muted)' }}><td><strong>{r.ticker}</strong><div className="xs muted">{r.advance === 0 ? 'Trades too thinly to sell quickly in a fall' : r.bank ? 'Bank share: allowed for a non-purpose loan' : r.stock.name}</div></td><td className="num">{n0(r.units)}</td><td className="num">₦{n2(r.valuation)}</td><td><LiquidityPill level={r.liquidity} /></td><td className="num">{Math.round(r.advance * 100)}%</td><td className="num">{r.advance > 0 ? <strong>{naira(r.borrowable)}</strong> : 'Not eligible'}</td></tr>)}
                {state.bonds.map(b => <tr key={b.id} style={{ color: 'var(--muted)' }}><td><strong>{b.name}</strong><div className="xs">Bonds and fund units as collateral</div></td><td className="num">{b.units}</td><td className="num">₦1,000.00</td><td><Pill>Phase 2</Pill></td><td className="num">up to 80%</td><td className="num">Coming</td></tr>)}
              </tbody></table></div>
              <div className="card-foot muted">No single stock may back more than {Math.round(s.maxConcentration * 100)}% of your loan. Advance rates can change if a stock's liquidity changes; we tell you 5 working days before.</div>
            </div>
          </div>
          <div className="stack">
            <div className="card ink">
              <div style={{ color: 'var(--gold)', fontWeight: 600, fontSize: 13 }}>You can borrow up to</div>
              <div style={{ fontSize: 40, fontWeight: 700, marginTop: 4 }} className="num">{naira(maxLoan)}</div>
              <div className="muted small" style={{ marginTop: 4 }}>against {naira(eligibleValue)} of eligible shares. Figure updates each trading day.</div>
              <div style={{ marginTop: 16, borderTop: '1px solid #2F5F8A', paddingTop: 14 }}>
                <div className="kv"><span className="muted">Interest from</span><span>{Math.round(s.loanRate * 100)}% a year</span></div>
                <div className="kv"><span className="muted">Tenor</span><span>3 to 12 months</span></div>
                <div className="kv"><span className="muted">Arrangement fee</span><span>{pct(s.arrangementFee * 100, 0)} once</span></div>
                <div className="kv"><span className="muted">Early repayment</span><span>No charge</span></div>
                <div className="kv"><span className="muted">Dividends while pledged</span><span>Still yours</span></div>
              </div>
              <Link className="btn btn-g btn-block btn-l" to="/lend/build" style={{ marginTop: 18 }}>Build my loan</Link>
              <div className="muted xs" style={{ marginTop: 10, textAlign: 'center' }}>Takes about 5 minutes. Money lands the same working day after approval.</div>
            </div>
            <div className="card"><h2 style={{ fontSize: 15 }}>What you don't need</h2><ul style={{ margin: '10px 0 0', paddingLeft: 18, lineHeight: 1.7 }}><li>No salary slip or bank statements</li><li>No guarantor</li><li>No visit to a branch</li><li>No selling your shares and missing the next dividend</li></ul><div className="muted xs" style={{ marginTop: 10 }}>The bank runs a credit bureau check at the signing step, with your consent.</div></div>
            <div className="card"><h2 style={{ fontSize: 15 }}>The one thing to understand</h2><p className="small" style={{ marginTop: 8, lineHeight: 1.6 }}>If your shares fall, the loan takes up a bigger share of their value. At a set point we ask you to add money or shares. If you don't, some shares are sold. We show that point on every screen and warn you three times before it. <Link to="/lend/learn">How margin calls work, with a ₦ example</Link></p></div>
          </div>
        </div>
      </div>
    </>
  )
}
