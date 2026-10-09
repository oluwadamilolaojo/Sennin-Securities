import React from 'react'
import { Link } from 'react-router-dom'
import DividendChecker from '../../components/DividendChecker.jsx'
import FeeCalc from '../../components/FeeCalc.jsx'
import Waitlist from './Waitlist.jsx'
import { useStore } from '../../store/store.jsx'
import { Pill } from '../../components/ui.jsx'

export default function Home() {
  const { state } = useStore()
  const fee = Math.round(state.settings.recoveryFee * 100)
  return (
    <>
      <section className="hero" id="check">
        <div className="wrap">
          <div>
            <h1>Nigerian companies may still owe you dividends.</h1>
            <p className="lede">Shares bought in the 90s, a bank offer in 2005, a parent's old certificates. Vendii checks every registrar for money in your name, recovers it into your bank account, and charges only when you're paid.</p>
            <div className="facts">
              <div><strong>₦270bn</strong><span>unclaimed dividends in Nigeria, by the SEC's own estimate</span></div>
              <div><strong>21</strong><span>registrars we check in one search</span></div>
              <div><strong>₦0</strong><span>to check. {fee}% only after the money lands in your bank</span></div>
            </div>
            <p className="src">Source: SEC investor awareness campaign on unclaimed dividends, 2026.</p>
          </div>
          <DividendChecker />
        </div>
      </section>

      <section className="block" id="products">
        <div className="wrap">
          <div className="sechead"><h2>One place for everything you own on the Nigerian market.</h2><p>Start by getting back what's already yours. Then grow it, or borrow against it without selling.</p></div>
          <div className="prod" id="recover">
            <div className="copy"><Pill kind="good">Available now</Pill><h3>Recover unclaimed dividends</h3><p>We match your BVN and NIN against registrar records, sign one power of attorney with you, and chase every registrar until the money is paid into your bank.</p><ul><li>One search across all 21 registrars</li><li>Estate claims for late parents and relatives</li><li>E-dividend mandates filled for you, so future dividends never go missing</li></ul><Link className="btn btn-p btn-l" to="/check">Check for free</Link></div>
            <div className="vignette" aria-hidden="true"><div className="vtitle">Your recovery, live</div><div className="vrow"><span>Nestle Nigeria</span><Pill kind="good">Paid ₦41,200</Pill></div><div className="vrow"><span>Flour Mills of Nigeria</span><Pill kind="warn">With registrar, day 12</Pill></div><div className="vrow"><span>Lafarge Africa</span><Pill kind="warn">Upload old certificate</Pill></div><div className="vrow"><span>UBA</span><Pill>Submitted</Pill></div></div>
          </div>
          <div className="prod flip" id="invest">
            <div className="copy"><Pill>Opens November 2026</Pill><h3>Invest in Nigerian shares, ETFs and government bonds</h3><p>Buy NGX shares by naira amount, subscribe to the FGN Savings Bond from ₦5,000, and see every charge before you confirm. Your shares sit at CSCS in your own name.</p><ul><li>Every fee itemised on the order screen, not just the commission</li><li>Warnings before you buy a stock that rarely trades</li><li>Order tracking from your phone to the exchange and into your CHN</li></ul><Link className="btn btn-line btn-l" to="/invest" style={{ border: '1.5px solid var(--line)', color: 'var(--text)' }}>How investing works</Link></div>
            <div className="vignette" aria-hidden="true"><div className="vtitle">Buy ZENITHBANK, ₦100,000</div><div className="vrow"><span>2,061 units at ₦48.50</span><span className="num">₦99,959</span></div><div className="vrow"><span className="muted">Commission, SEC, NGX and CSCS fees</span><span className="num">₦2,000</span></div><div className="vrow"><span className="muted">Stamp duty and VAT</span><span className="num">₦147</span></div><div className="vrow"><strong>Total</strong><strong className="num">₦102,106</strong></div><div className="vrow"><span className="muted">Liquidity</span><Pill kind="good">High, sells easily</Pill></div></div>
          </div>
          <div className="prod" id="borrow">
            <div className="copy"><Pill>Opens March 2027</Pill><h3>Borrow against your shares without selling them</h3><p>Use shares held with Vendii or any other broker as security for a loan from Trust Bank. Keep earning dividends while you repay, with no salary slip or guarantor.</p><ul><li>See your limit in seconds before you apply</li><li>A loan health bar that shows exactly when you'd need to act</li><li>Repay any day with no early repayment charge</li></ul><Link className="btn btn-l" to="/borrow" style={{ border: '1.5px solid var(--line)', color: 'var(--text)' }}>How borrowing works</Link></div>
            <div className="vignette" aria-hidden="true"><div className="vtitle">Loan health</div><div className="row" style={{ alignItems: 'baseline' }}><strong style={{ fontSize: 26, color: 'var(--good)' }}>Healthy</strong><span className="num">loan is 30.8% of share value</span></div><div className="hbar" style={{ marginTop: 10 }}><i className="z1" style={{ width: '62.5%' }} /><i className="z2" style={{ left: '62.5%', width: '9%' }} /><i className="z3" style={{ left: '71.5%' }} /><i className="fill" style={{ width: '30.8%', background: 'var(--good)' }} /></div><div className="vrow" style={{ marginTop: 14 }}><span>Borrowed</span><span className="num">₦900,000</span></div><div className="vrow"><span>Monthly payment</span><span className="num">₦160,689</span></div><div className="vrow"><span>Dividends on pledged shares</span><span>Still paid to you</span></div></div>
          </div>
        </div>
      </section>

      <section className="block alt" id="how">
        <div className="wrap">
          <div className="sechead"><h2>How recovery works</h2><p>Most claims close in [3 to 8] weeks, depending on the registrar. You can see every step while you wait.</p></div>
          <ol className="how">
            <li><h3>Check for free</h3><p>Search your name, or a late relative's. We show likely matches and an estimated amount.</p></li>
            <li><h3>Prove it's you</h3><p>BVN, NIN and a selfie. For an estate, upload the letters of administration or probate.</p></li>
            <li><h3>Sign once</h3><p>One power of attorney lets us deal with every registrar for you. No office visits.</p></li>
            <li><h3>Get paid</h3><p>The registrar pays straight into your bank. We then take our {fee}% by direct debit.</p></li>
          </ol>
        </div>
      </section>

      <section className="block" id="pricing">
        <div className="wrap">
          <div className="sechead"><h2>What it costs, in naira</h2><p>No subscriptions and no hidden spreads. Here is how Vendii makes money, and what the government and the exchange charge on top.</p></div>
          <div className="pricing">
            <div className="tablebox"><table className="ptable"><thead><tr><th scope="col">Service</th><th scope="col">What you pay</th><th scope="col">Example</th></tr></thead><tbody>
              <tr><td>Dividend check</td><td>Free</td><td className="muted">Search as many names as you like</td></tr>
              <tr><td>Dividend recovery</td><td>{fee}% of what's recovered, only after it's paid to you</td><td className="muted">Recover ₦100,000, keep ₦{(100000 * (1 - state.settings.recoveryFee)).toLocaleString()}</td></tr>
              <tr><td>Buying and selling shares</td><td>{(state.settings.commission * 100).toFixed(2)}% commission plus statutory charges (SEC, NGX, CSCS, stamp duty, VAT)</td><td className="muted">Use the calculator to see every line</td></tr>
              <tr><td>FGN Savings Bond</td><td>No fee from Vendii</td><td className="muted">₦100,000 gets the full government rate</td></tr>
              <tr><td>Share-backed loan</td><td>Interest from {Math.round(state.settings.loanRate * 100)}% a year, {Math.round(state.settings.arrangementFee * 100)}% arrangement fee, CSCS lien fee</td><td className="muted">No charge to repay early</td></tr>
              <tr><td>Deposits and withdrawals</td><td>Free by bank transfer</td><td className="muted">Withdrawals only to your own account</td></tr>
            </tbody></table></div>
            <FeeCalc />
          </div>
        </div>
      </section>

      <section className="block alt" id="safety">
        <div className="wrap">
          <div className="sechead"><h2>Where your money and shares actually sit</h2><p>Investing has burned a lot of Nigerians. So here is exactly who holds what, and how to check us without taking our word for it.</p></div>
          <div className="safety">
            {[['Shares in your own name at CSCS', 'Every share you buy is registered to your Clearing House Number at the Central Securities Clearing System. Vendii can\'t move them without your instruction.'], ['Cash kept apart from ours', 'Your cash sits in a client account with Trust Bank, our sponsoring broker\'s bank, separate from Vendii\'s operating money. Withdrawals go only to a bank account in your name.'], ['Licensed, and checkable', '[Vendii legal entity] is registered with the Securities and Exchange Commission, Nigeria, as a digital sub-broker, registration [number]. Search our name on the SEC register of capital market operators to confirm.'], ['Your data, protected', 'Registered with the Nigeria Data Protection Commission. Your BVN and NIN are used only to verify you and match registrar records, never sold.'], ['Official channels only', 'Our support lines are listed on this site and inside the app. If someone calls from another number claiming to be Vendii, hang up and report it.'], ['Service status in public', 'If something is down or slow, our status page says so before you have to ask. You\'ll also see how long withdrawals are taking today.']].map(([h, p]) => <div className="safe-item" key={h}><h3>{h}</h3><p>{p}</p></div>)}
          </div>
          <div className="promise"><div><h3>The Vendii Promise</h3><p>If a mistake on our side costs you money, we put it right at our cost. If we're slow, we tell you why and when. Draft wording, pending legal review.</p><Link className="btn btn-g" to="/safety" style={{ marginTop: 20 }}>Read the full promise</Link></div><ul><li><strong>Real people</strong> on chat, WhatsApp and phone, [hours]</li><li><strong>Complaints</strong> acknowledged within 1 working day, with a tracked deadline you can see</li><li><strong>Withdrawals</strong> within [2] working hours, or we tell you the reason</li></ul></div>
        </div>
      </section>

      <section className="block" id="estates">
        <div className="wrap">
          <div className="sechead"><h2>Which of these sounds like you?</h2></div>
          <div className="sits">
            <div className="sit"><h3>Sorting out a late parent's shares</h3><p>You've found old certificates or dividend warrants in a drawer. We find what they're worth, handle the transmission paperwork, and pay the estate.</p><Link to="/check?mode=family">Start a family check</Link></div>
            <div className="sit"><h3>Living outside Nigeria</h3><p>You bought shares before you moved, or inherited some. Everything happens online, with your BVN, NIN and passport, paid to your Nigerian account.</p><Link to="/check">Check from abroad</Link></div>
            <div className="sit"><h3>Never invested before</h3><p>Start with the FGN Savings Bond from ₦5,000 or a large, liquid NGX company. We explain every term on the screen where you meet it.</p><Link to="/signup">Get early access</Link></div>
          </div>
        </div>
      </section>

      <section className="block alt" id="learn">
        <div className="wrap">
          <div className="sechead"><h2>Free tools and plain guides</h2><p>Useful whether or not you ever open an account.</p></div>
          <div className="tools">
            <Link className="tool" to="/learn#calendar"><strong>Nigerian dividend calendar</strong><span>Every declared dividend, qualification date and payment date on the NGX</span></Link>
            <Link className="tool" to="/learn#bond"><strong>FGN Savings Bond calculator</strong><span>This month's rates and your quarterly interest, in naira</span></Link>
            <Link className="tool" to="/learn#chn"><strong>What is a CHN, and do I have one?</strong><span>The 3-minute guide to your clearing house number</span></Link>
            <Link className="tool" to="/learn#estate"><strong>Claiming a late relative's shares</strong><span>Probate, letters of administration and transmission, step by step</span></Link>
          </div>
        </div>
      </section>

      <section className="block" id="faq">
        <div className="wrap">
          <div className="sechead"><h2>Questions people ask first</h2></div>
          <div className="faq">
            {[['Is the dividend check really free?', `Yes. Searching costs nothing and doesn't commit you to anything. You only pay if you choose to recover, and then only ${fee}% of what actually lands in your bank account.`], ['Why do you need my BVN?', 'Registrars now match claims against BVN and NIN records. We use yours to prove the shares are yours and to make sure the money is paid to an account in your name.'], ['My dividends are over six years old. Are they gone?', 'No. Dividends unclaimed for six years or more move to the Federal Government\'s Unclaimed Funds Trust Fund, where the government holds them as custodian. They can still be claimed, and we handle that claim too.'], ['Can I claim for my late father or mother?', 'Yes, if you are an administrator or executor of the estate. You\'ll need the death certificate and letters of administration or probate. We tell you exactly what\'s missing before anything is submitted.'], ['Who holds my shares if I invest through Vendii?', 'The Central Securities Clearing System, in your own name, under your CHN. Trades go through our sponsoring broker, Trust Bank Securities. Vendii never owns your shares.'], ['What happens to my shares if I borrow against them?', 'They stay yours and keep earning dividends. A lien is placed on them at CSCS while the loan is open. The lien lifts automatically when you repay. If the shares fall a long way, you\'ll be warned several times before any are sold.']].map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
          </div>
        </div>
      </section>

      <Waitlist />
    </>
  )
}
