import React from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import DividendChecker from '../../components/DividendChecker.jsx'

export default function Check() {
  const [sp] = useSearchParams()
  const family = sp.get('mode') === 'family'
  return (
    <>
      <section className="hero"><div className="wrap">
        <div>
          <h1>{family ? 'Check a late relative\'s shares.' : 'Find dividends in your name.'}</h1>
          <p className="lede">{family ? 'Type the name exactly as it would have appeared on their share certificates, including any former names. If we find matches, we tell you which estate documents each registrar will ask for.' : 'Type your name as it would have appeared on the share certificate. We search all 21 registrars and show you likely matches and an estimate.'}</p>
          {family && <div className="card" style={{ marginTop: 24, background: 'var(--blue-dk)', border: 0, color: '#fff' }}><div style={{ fontWeight: 600 }}>You'll need, eventually</div><ul style={{ margin: '8px 0 0', paddingLeft: 18, color: '#C9D6E4', lineHeight: 1.7 }}><li>Death certificate</li><li>Letters of administration (no will) or probate (with a will)</li><li>Your own BVN and ID as administrator or executor</li></ul><div className="small" style={{ color: '#C9D6E4', marginTop: 8 }}>Nothing is needed to search.</div></div>}
        </div>
        <DividendChecker />
      </div></section>
      <section className="block"><div className="wrap">
        <div className="sechead"><h2>What happens after a match</h2><p>A match is a likely record, not a promise. The registrar confirms it against your BVN and NIN before any money moves.</p></div>
        <ol className="how"><li><h3>Sign up with BVN</h3><p>About five minutes. We open your CSCS number through Trust Bank Securities at the same time.</p></li><li><h3>Sign one POA</h3><p>It lets us act for you at every registrar. You can revoke it any time.</p></li><li><h3>We chase</h3><p>Each registrar has its own checklist. You see every step in the app and on WhatsApp.</p></li><li><h3>Paid to your bank</h3><p>Registrars pay you directly. We debit our fee afterwards. <Link to="/pricing">See pricing</Link></p></li></ol>
      </div></section>
    </>
  )
}
