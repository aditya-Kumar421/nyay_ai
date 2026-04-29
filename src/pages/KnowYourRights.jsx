import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../api/axios'

export default function KnowYourRights() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('nyay_user') || '{}')
  const userId = user?.id || user?._id || null

  const [history, setHistory] = useState([])
  const [selected, setSelected] = useState(null)
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!userId) return
    fetchHistory()
  }, [userId])

  async function fetchHistory() {
    setLoading(true)
    try {
      const { data } = await api.get(`/know-your-rights/user/${userId}`)
      setHistory(Array.isArray(data) ? data : data.items || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function openItem(id) {
    setLoading(true)
    try {
      const { data } = await api.get(`/know-your-rights/${id}`)
      setSelected(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleAsk(e) {
    e.preventDefault()
    if (!q.trim()) return
    if (!userId) { setError('Please sign in to ask.'); return }
    setLoading(true)
    try {
      const body = { user_id: Number(userId), question: q }
      const { data } = await api.post('/know-your-rights', body)
      setHistory(prev => [data, ...prev])
      setSelected(data)
      setQ('')
    } catch (err) {
      console.error(err)
      setError('Failed to ask. Try again.')
    } finally {
      setLoading(false)
    }
  }

  function getGreeting() {
    const h = new Date().getHours()
    if (h < 12) return 'Morning'
    if (h < 17) return 'Afternoon'
    return 'Evening'
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="container" style={{ padding: '12px 18px' }}>
        <div className="kyr-shell">
          <aside className="kyr-history">
            <div className="kyr-back-wrap">
              <button className="kyr-back" onClick={() => navigate('/petitioner')}>← Dashboard</button>
            </div>
            <div className="kyr-profile">
              <div className="kyr-av">{user.name ? user.name.split(' ')[0][0] : 'U'}</div>
              <div>
                <div className="kyr-name">{user.name || 'You'}</div>
                <div className="kyr-email">{user.email || ''}</div>
              </div>
            </div>

            <div className="kyr-history-label">History</div>
            <div className="kyr-history-list">
              {loading && history.length === 0 && <div className="kyr-empty">Loading…</div>}
              {!loading && history.length === 0 && <div className="kyr-empty">No previous questions.</div>}
              {history.map(h => {
                const itemId = h.id || h._id
                const isActive = selected && (String(selected.id) === String(itemId) || String(selected._id) === String(itemId))
                return (
                  <div id={`kyr-item-${itemId}`} key={itemId} className={`kyr-history-item ${isActive ? 'active' : ''}`} onClick={() => openItem(itemId)}>
                    <div className="kyr-history-q">{h.question}</div>
                  </div>
                )
              })}
            </div>
          </aside>

          <section className="kyr-main">
            <div className="kyr-header">
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontWeight: 900, fontSize: '1.25rem' }}>{selected ? selected.question : `Good ${getGreeting()}, ${user.name?.split(' ')[0] || 'there'}`}</div>
              </div>
            </div>

            <div className="kyr-messages" id="kyr-messages">
              {!selected && <div className="kyr-empty-main">Ask a question to get started.</div>}
              {selected && (
                <div className="kyr-response">
                  <div className="kyr-block">
                    <div className="kyr-block-title">Legal Rights &gt;&gt;</div>
                    <div className="kyr-block-body">{selected.response?.legal_rights || '—'}</div>
                  </div>
                  <div className="kyr-block">
                    <div className="kyr-block-title">Actions &gt;&gt;</div>
                    <div className="kyr-block-body">{selected.response?.actions || '—'}</div>
                  </div>
                  <div className="kyr-block">
                    <div className="kyr-block-title">When to hire a lawyer &gt;&gt;</div>
                    <div className="kyr-block-body">{selected.response?.when_to_hire_lawyer || '—'}</div>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleAsk} className="kyr-input" onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAsk(e);
              }
            }}>
              {error && <div className="alert alert-error">{error}</div>}
              <div className="kyr-input-bar">
                {/* <button type="button" className="kyr-icon-btn" aria-label="add">
                  +
                </button> */}
                <textarea
                  className="kyr-input-text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="How can I help you today?"
                  rows={1}
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                />

                <button type="submit" className="kyr-send-btn" aria-label="send" disabled={loading}>
                  {loading ? <span className="kyr-loader"></span> : "↑"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  )
}
