import React, { useEffect } from 'react'
import { TopBar } from '../../layouts/Shell.jsx'
import { useStore } from '../../store/store.jsx'
import { fmtTime } from '../../utils.js'

export default function Notifications() {
  const { state, dispatch } = useStore()
  useEffect(() => { const t = setTimeout(() => dispatch({ type: 'READ_NOTIFS' }), 1500); return () => clearTimeout(t) }, [dispatch])
  return (
    <>
      <TopBar title="Notifications" />
      <div className="content">
        <div className="card" style={{ maxWidth: 760 }}>
          <div className="stack" style={{ gap: 8 }}>
            {state.notifications.map(n => <div className="rowline" key={n.id} style={{ alignItems: 'flex-start', background: n.read ? 'var(--paper)' : '#D6E4F0' }}><span><strong>{n.title}</strong><div className="small">{n.body}</div></span><span className="muted xs" style={{ whiteSpace: 'nowrap' }}>{fmtTime(n.ts)}</span></div>)}
            {!state.notifications.length && <div className="muted">Nothing yet.</div>}
          </div>
        </div>
      </div>
    </>
  )
}
