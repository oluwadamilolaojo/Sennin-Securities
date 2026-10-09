import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import { naira, pct, initials } from '../utils.js'

export function Logo({ size = 30, dark = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" aria-hidden="true">
      <circle cx="15" cy="15" r="15" fill={dark ? '#295D8F' : '#C59F56'} />
      <path d="M15 5 L19 15 L15 25 L11 15 Z" fill={dark ? '#fff' : '#17375A'} />
      <circle cx="15" cy="15" r="2" fill={dark ? '#295D8F' : '#C59F56'} />
    </svg>
  )
}

export const Pill = ({ kind = 'grey', children, style }) => <span className={'pill ' + kind} style={style}>{children}</span>

export function statusPill(status) {
  const map = {
    'Settled': 'good', 'Filled': 'good', 'Paid': 'good', 'Active': 'good', 'Verified': 'good', 'Resolved': 'good', 'Approved': 'good', 'Repaid': 'good',
    'Partly filled': 'warn', 'With registrar': 'warn', 'Identity check': 'warn', 'Action needed': 'warn', 'Pending approval': 'warn', 'Pending review': 'warn', 'Documents pending': 'warn', 'Investigating': 'warn', 'Awaiting probate': 'warn', 'Selfie mismatch': 'bad', 'Margin call': 'bad',
    'Cancelled': 'grey', 'Cancelled (part filled)': 'grey', 'Declined': 'bad', 'Open': 'bad',
    'Received': 'info', 'Sent to broker': 'info', 'On exchange': 'info', 'Queued for open': 'grey', 'Submitted': 'info', 'Needed': 'warn',
  }
  return <Pill kind={map[status] || 'grey'}>{status}</Pill>
}

export const Stat = ({ label, value, sub, ink, className = '' }) => (
  <div className={'stat ' + (ink ? 'ink ' : '') + className}>
    <div className="lab">{label}</div>
    <div className="val">{value}</div>
    {sub && <div className="sub">{sub}</div>}
  </div>
)

export function Seg({ options, value, onChange, ariaLabel }) {
  return (
    <div className="seg" role="group" aria-label={ariaLabel}>
      {options.map(o => (
        <button key={o.value} type="button" className={value === o.value ? 'on' : ''} onClick={() => onChange(o.value)}>{o.label}</button>
      ))}
    </div>
  )
}

export function Field({ label, id, children, hint }) {
  return (
    <div>
      {label && <label className="lbl" htmlFor={id}>{label}</label>}
      {children}
      {hint && <div className="xs muted" style={{ marginTop: 6 }}>{hint}</div>}
    </div>
  )
}

export function Switch({ on, onChange, label }) {
  return <button type="button" className={'sw' + (on ? ' on' : '')} aria-pressed={on} aria-label={label} onClick={onChange}><span /></button>
}

export function HealthBar({ ltv, settings, color }) {
  const w = settings.warnLtv * 100, c = settings.callLtv * 100
  const fill = Math.min(100, ltv * 100)
  const col = color || (ltv >= settings.callLtv ? 'var(--bad)' : ltv >= settings.warnLtv ? 'var(--gold)' : 'var(--good)')
  return (
    <div>
      <div className="hbar" role="img" aria-label={`Loan is ${pct(ltv * 100)} of collateral value`}>
        <i className="z1" style={{ width: w + '%' }} />
        <i className="z2" style={{ left: w + '%', width: (c - w) + '%' }} />
        <i className="z3" style={{ left: c + '%' }} />
        <i className="fill" style={{ width: fill + '%', background: col }} />
      </div>
      <div className="hlabels"><span>0%</span><span>Warning {pct(w)}</span><span>Add cover {pct(c)}</span><span>Shares sold {pct(settings.liqLtv * 100)}</span></div>
    </div>
  )
}

export function OrderSteps({ order }) {
  const steps = ['Received', 'Sent to broker', 'On exchange', 'Partly filled', 'Filled', 'Settled']
  const done = order.timeline.map(t => t[0])
  const curIdx = steps.indexOf(order.status)
  return (
    <div className="steps">
      <div className="line"><i style={{ width: Math.max(0, (curIdx / (steps.length - 1)) * 100) + '%' }} /></div>
      {steps.map((s, i) => {
        const isDone = done.includes(s) && i < curIdx
        const now = i === curIdx
        const t = order.timeline.find(x => x[0] === s)
        return (
          <div key={s} className={'step' + (isDone ? ' done' : '') + (now ? ' now' : '')}>
            <div className="d">{isDone ? '✓' : i + 1}</div>
            <div><strong>{s}</strong><div className="muted xs">{t ? new Date(t[1]).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : s === 'Partly filled' && order.filled ? `${order.filled.toLocaleString()} of ${order.units.toLocaleString()}` : ''}</div></div>
          </div>
        )
      })}
    </div>
  )
}

export function Modal({ title, onClose, children }) {
  return (
    <div className="modal-bg" onClick={onClose} role="presentation">
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={e => e.stopPropagation()}>
        <div className="row"><h2>{title}</h2><button className="linkbtn" type="button" onClick={onClose}>Close</button></div>
        {children}
      </div>
    </div>
  )
}

export function Toasts() {
  const { state } = useStore()
  if (!state.toasts.length) return null
  return <div className="toasts" aria-live="polite">{state.toasts.map(t => <div key={t.id} className={'toast ' + t.kind}>{t.text}</div>)}</div>
}

export function Sparkline({ data, width = 800, height = 200, color = '#295D8F' }) {
  const min = Math.min(...data), max = Math.max(...data)
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - 10 - ((v - min) / ((max - min) || 1)) * (height - 20)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} role="img" aria-label="Price chart, sample data" style={{ display: 'block' }}>
      {[0.2, 0.4, 0.6, 0.8].map(f => <line key={f} x1="0" x2={width} y1={height * f} y2={height * f} stroke="#EEF2F6" />)}
      <polyline fill="none" stroke={color} strokeWidth="2.5" points={pts} />
    </svg>
  )
}

export const Empty = ({ title, body, action }) => (
  <div className="empty"><h3>{title}</h3><p>{body}</p>{action && <div style={{ marginTop: 14 }}>{action}</div>}</div>
)

export function LiquidityPill({ level }) {
  const map = { High: ['good', 'High, sells easily'], Medium: ['warn', 'Medium'], Thin: ['grey', 'Thin, slow to sell'] }
  const [k, t] = map[level] || ['grey', level]
  return <Pill kind={k}>{t}</Pill>
}

export function Avatar({ name }) { return <div className="avatar">{initials(name)}</div> }

export function Tabs({ tabs, value, onChange }) {
  return <div className="tabs">{tabs.map(t => <button key={t.value} type="button" className={value === t.value ? 'on' : ''} onClick={() => onChange(t.value)}>{t.label}</button>)}</div>
}

export function PhaseTag({ phase }) { return <Pill kind="grey">{phase}</Pill> }

export { Link, NavLink, naira }
