import { useState, useEffect, useRef } from 'react'
import api from '../api/axios'

function timeAgo(ts) {
  try {
    const d = new Date(ts)
    const diff = Math.floor((Date.now() - d.getTime()) / 1000)
    if (diff < 60) return `${diff}s`
    if (diff < 3600) return `${Math.floor(diff / 60)}m`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`
    return d.toLocaleDateString()
  } catch { return ts }
}

export default function MessagesWidget({ mode = 'receiver' }) {
  const user = JSON.parse(localStorage.getItem('nyay_user') || '{}')
  const userId = user._id || user.id
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const mounted = useRef(false)

  async function fetchMessages() {
    if (!userId) return
    setLoading(true)
    setError('')
    try {
      // support both receiver (lawyer) and sender (petitioner) views
      const endpoint = mode === 'sender' ? '/messages/by-sender' : '/messages/by-receiver'
      const body = mode === 'sender' ? { sender_id: userId } : { receiver_id: userId }
      const { data } = await api.post(endpoint, body)
      // assume endpoint returns incoming messages for this receiver/sender
      setMessages(Array.isArray(data) ? data : [])
    } catch (err) {
      setError('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    mounted.current = true
    fetchMessages()
    const iv = setInterval(fetchMessages, 30000)
    return () => { mounted.current = false; clearInterval(iv) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const unreadCount = messages.filter(m => !m.is_read).length

  return (
    <div className="messages-widget">
      <div
        className={`mw-collapsed ${open ? 'open' : ''}`}
        onClick={() => { setOpen(v => !v); if (!open) fetchMessages() }}
        role="button"
        tabIndex={0}
      >
        <div className="mw-collapsed-left">
          <div className="mw-collapsed-av">{(user.name && user.name[0]) || 'P'}</div>
          <div className="mw-collapsed-title">Messages</div>
        </div>
        <div className="mw-collapsed-actions">
          <button className="mw-action-btn" title="More" onClick={(e) => { e.stopPropagation(); /* placeholder */ }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </button>
          <button className="mw-action-btn" title="Refresh" onClick={(e) => { e.stopPropagation(); fetchMessages(); }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-3-6.7" />
              <polyline points="21 3 21 9 15 9" />
            </svg>
          </button>
          <button className="mw-action-btn" title="Toggle" onClick={(e) => { e.stopPropagation(); setOpen(v => !v) }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {open ? <path d="M6 9l6 6 6-6"/> : <path d="M6 15l6-6 6 6"/>}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="mw-panel fade-in" onClick={(e) => e.stopPropagation()}>
          <div className="mw-list">
            {loading && <div style={{ padding: '14px', color: 'var(--text-muted)' }}>Loading…</div>}
            {error && <div className="alert alert-error">{error}</div>}
            {!loading && messages.length === 0 && (
              <div style={{ padding: '14px', color: 'var(--text-muted)' }}>No messages yet.</div>
            )}

            {!loading && messages.map(m => (
              <div key={m.id} className={`mw-item ${m.is_read ? '' : 'mw-unread'}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div className="mw-av">P</div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Petitioner</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>{m.purpose || 'Message'}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'right' }}>{timeAgo(m.timestamp)}</div>
                </div>
                <div style={{ marginTop: '8px', color: 'var(--text-primary)' }}>{m.content}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: '10px', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Messages are read-only here. Reply feature coming soon.</div>
          </div>
        </div>
      )}
    </div>
  )
}
