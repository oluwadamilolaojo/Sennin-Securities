import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import { REGISTRARS } from '../data/mock.js'
import { naira } from '../utils.js'

const SAMPLE = [['Flour Mills of Nigeria', 'Africa Prudential', '2016 to 2022', 52750], ['Nestle Nigeria', 'Meristem Registrars', '2014 to 2019', 41200], ['Lafarge Africa', 'Coronation Registrars', '2012 to 2018', 23900], ['UBA', 'Africa Prudential', '2020 to 2023', 9600]]

function Guilloche() {
  const ref = useRef(null)
  useEffect(() => {
    const svg = ref.current; if (!svg) return
    function draw() {
      const box = svg.getBoundingClientRect(), W = Math.max(300, box.width), H = Math.max(300, box.height)
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
      let out = ''
      const ros = (cx, cy, R, r, d, turns, steps, color, op) => { let p = ''; for (let i = 0; i <= steps; i++) { const t = i / steps * Math.PI * 2 * turns; const x = cx + (R - r) * Math.cos(t) + d * Math.cos((R - r) / r * t), y = cy + (R - r) * Math.sin(t) - d * Math.sin((R - r) / r * t); p += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1) } return `<path d="${p}" fill="none" stroke="${color}" stroke-width="0.6" opacity="${op}"/>` }
      const m = Math.min(W, H)
      out += ros(W / 2, H * .52, m * .34, m * .34 * .29, m * .21, 7, 1400, '#C59F56', .22)
      out += ros(W / 2, H * .52, m * .26, m * .26 * .39, m * .15, 5, 1000, '#295D8F', .10)
      for (let b = 0; b < 4; b++) { const amp = 3 + b * .6, per = 18 + b * 2, off = 10 + b * 1.6; let pt = '', pb = ''; for (let x = 0; x <= W; x += 2) { pt += (x ? 'L' : 'M') + x + ' ' + (off + amp * Math.sin(x / per * Math.PI * 2 + b)).toFixed(1); pb += (x ? 'L' : 'M') + x + ' ' + (H - off - amp * Math.sin(x / per * Math.PI * 2 + b)).toFixed(1) } out += `<path d="${pt}" fill="none" stroke="#C59F56" stroke-width="0.6" opacity=".55"/><path d="${pb}" fill="none" stroke="#C59F56" stroke-width="0.6" opacity=".55"/>` }
      svg.innerHTML = out
    }
    draw(); let t; const onR = () => { clearTimeout(t); t = setTimeout(draw, 150) }; window.addEventListener('resize', onR); return () => window.removeEventListener('resize', onR)
  }, [])
  return <svg ref={ref} className="guilloche" aria-hidden="true" />
}

export default function DividendChecker({ compact = false }) {
  const { state, dispatch } = useStore()
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [maiden, setMaiden] = useState('')
  const [company, setCompany] = useState('')
  const [phase, setPhase] = useState('form')
  const [done, setDone] = useState(0)
  const [err, setErr] = useState(false)
  const regs = [...REGISTRARS.slice(0, 7), '14 more registrars']
  useEffect(() => {
    if (phase !== 'scan') return
    if (done < regs.length) { const t = setTimeout(() => setDone(d => d + 1), 220); return () => clearTimeout(t) }
    const t = setTimeout(() => setPhase('result'), 400); return () => clearTimeout(t)
  }, [phase, done])
  function submit(e) {
    e.preventDefault()
    if (name.trim().split(/\s+/).length < 2) { setErr(true); return }
    setErr(false); setDone(0); setPhase('scan')
    dispatch({ type: 'SET_CHECK', check: { name, maiden, company, total: 127450, matches: SAMPLE } })
  }
  return (
    <div className="cert">
      <div className="cert-frame">
        <Guilloche />
        <div className="inner">
          <div className="cert-head"><div className="k">Free dividend check</div><h2>Is there money in your name?</h2><p>Takes about a minute. No BVN needed to look.</p></div>
          {phase === 'form' && (
            <form onSubmit={submit} noValidate>
              <div><label className="lbl" htmlFor="fullname">Full name as it appeared on your shares</label><input id="fullname" className="inp" value={name} onChange={e => setName(e.target.value)} autoComplete="name" placeholder="e.g. Adebayo Oluwaseun Ojo" /></div>
              <div className="row2">
                <div><label className="lbl" htmlFor="maiden">Former or maiden name (optional)</label><input id="maiden" className="inp" value={maiden} onChange={e => setMaiden(e.target.value)} placeholder="if it was different" /></div>
                <div><label className="lbl" htmlFor="company">A company you remember (optional)</label><input id="company" className="inp" value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. First Bank, Nestle" /></div>
              </div>
              {err && <p className="alert bad" role="alert">Enter the full name that would be on the share certificate.</p>}
              <button className="btn btn-p btn-l" type="submit">Check all 21 registrars</button>
              <p className="fine">Checking for someone who passed away? <Link to="/check?mode=family">Use the family check</Link></p>
            </form>
          )}
          {phase === 'scan' && <div className="scan" aria-live="polite"><ol>{regs.map((r, i) => <li key={r} className={i < done ? 'done' : ''}><span>{r}</span><span className="st">{i < done ? ([0, 1, 2].includes(i) ? 'Match found' : i === regs.length - 1 ? 'Done' : 'No match') : 'Checking'}</span></li>)}</ol></div>}
          {phase === 'result' && (
            <div className="result" aria-live="polite">
              <span className="demo">Demo result, sample data</span>
              <div style={{ marginTop: 10, fontFamily: 'var(--serif)', fontSize: 16 }}>Possible matches for <strong>{name}</strong></div>
              <div className="amt num">{naira(127450)}</div>
              <div className="small" style={{ color: '#51627A' }}>estimated across 4 companies and 3 registrars</div>
              <table><tbody>{SAMPLE.map(([c, r, y, a]) => <tr key={c}><td>{c}<div className="xs" style={{ color: '#51627A' }}>{r} · {y}</div></td><td className="num">{naira(a)}</td></tr>)}</tbody></table>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
                <button className="btn btn-g btn-l" type="button" onClick={() => nav(state.auth.signedIn ? '/app/dividends?tab=recovery' : '/signup?intent=recover')}>Recover it with your BVN</button>
                <button className="linkbtn" type="button" onClick={() => { setPhase('form'); setName('') }}>Check another name</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
