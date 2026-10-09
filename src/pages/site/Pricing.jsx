import React from 'react'
import FeeCalc from '../../components/FeeCalc.jsx'
import { useStore } from '../../store/store.jsx'

export default function Pricing() {
  const { state } = useStore()
  const s = state.settings
  return (
    <>
      <div className="wrap page-hero"><h1>What it costs, and how we make money.</h1><p>No subscriptions, no hidden spreads, no payment for order flow. Three sources of revenue, all listed here.</p></div>
      <section className="block alt"><div className="wrap">
        <div className="pricing" style={{ marginTop: 0 }}>
          <div className="tablebox"><table className="ptable"><thead><tr><th>Service</th><th>What you pay</th><th>Example</th></tr></thead><tbody>
            <tr><td>Dividend check</td><td>Free</td><td className="muted">Search as many names as you like</td></tr>
            <tr><td>Dividend recovery</td><td>{Math.round(s.recoveryFee * 100)}% of what's recovered, only after it's paid to you</td><td className="muted">Recover ₦100,000, keep ₦{(100000 * (1 - s.recoveryFee)).toLocaleString()}</td></tr>
            <tr><td>Buying and selling shares</td><td>{(s.commission * 100).toFixed(2)}% commission plus statutory charges</td><td className="muted">SEC {(s.secFee * 100).toFixed(2)}%, NGX {(s.ngxFee * 100).toFixed(2)}%, CSCS {(s.cscsFee * 100).toFixed(2)}%, stamp duty {(s.stampDuty * 100).toFixed(3)}%, VAT {(s.vat * 100).toFixed(1)}% on fees</td></tr>
            <tr><td>FGN Savings Bond</td><td>No fee from Vendii</td><td className="muted">₦100,000 gets the full government rate</td></tr>
            <tr><td>Share-backed loan</td><td>Interest from {Math.round(s.loanRate * 100)}% a year, {Math.round(s.arrangementFee * 100)}% arrangement fee, ₦{s.lienFee.toLocaleString()} CSCS lien fee</td><td className="muted">No charge to repay early</td></tr>
            <tr><td>Deposits and withdrawals</td><td>Free by bank transfer</td><td className="muted">Withdrawals only to your own account</td></tr>
            <tr><td>Statements and contract notes</td><td>Free</td><td className="muted">Monthly, and per trade</td></tr>
          </tbody></table></div>
          <FeeCalc />
        </div>
        <div className="sechead" style={{ marginTop: 64 }}><h2>How we make money</h2><p>Three ways. Recovery fees when we get your dividends paid. Brokerage commission when you trade. A share of the interest when a partner bank lends against your shares. We do not sell your data, and we do not take payment for routing your orders.</p></div>
      </div></section>
    </>
  )
}
