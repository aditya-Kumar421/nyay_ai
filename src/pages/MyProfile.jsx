import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../api/axios'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export default function MyProfile() {
  const query = useQuery()
  const userId = query.get('user_id')
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [message, setMessage] = useState({ content: '' })
  const [cases, setCases] = useState([])
  const [selectedCase, setSelectedCase] = useState('')
  const navigate = useNavigate()
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [sendSuccess, setSendSuccess] = useState('')

  useEffect(() => {
    if (!userId) { setError('No user id provided'); setLoading(false); return }
    async function fetchProfile() {
      setLoading(true)
      setError('')
      try {
        const { data } = await api.get('/my-profile', { params: { user_id: userId } })
        setProfile(data.user || data || null)
      } catch (err) {
        setError('Could not load profile.')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
    // also fetch current user's cases for dropdown
    const sender = JSON.parse(localStorage.getItem('nyay_user') || 'null')
    if (sender && sender._id) {
      (async function fetchCases() {
        try {
          const { data } = await api.get('/my-cases', { params: { user_id: sender._id } })
          const list = Array.isArray(data) ? data : data.cases || []
          setCases(list)
        } catch (err) {
          // ignore silently; dropdown will remain empty
        }
      })()
    }
  }, [userId])

  async function handleSend(e) {
    e.preventDefault()
    setSendError('')
    setSendSuccess('')
    const sender = JSON.parse(localStorage.getItem('nyay_user') || 'null')
    const senderId = sender && sender._id ? sender._id : 0
    if (!message.content.trim()) { setSendError('Message cannot be empty.'); return }

    setSending(true)
    setSendError('')
    // optimistic success: show message sent even if backend fails
    setSendSuccess('Message sent successfully')
    setMessage({ content: '' })
    setSelectedCase('')
    try {
      const body = {
        case_id: Number(selectedCase) || 0,
        receiver_id: userId,
        content: message.content,
      }
      await api.post('/send-message', body, { params: { sender_id: senderId } })
    } catch (err) {
      // intentionally ignored: user requested optimistic success
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="container" style={{ padding: '40px 24px', flex: 1 }}>
        <div style={{ marginBottom: '20px' }}>
          <div className="section-label">Profile</div>
          <button className="btn btn-outline" onClick={() => { if (window.history.length > 1) navigate(-1); else navigate('/search-lawyers') }} style={{ marginTop: '8px' }}>← Back</button>
        </div>

        {loading ? (
          <div>Loading…</div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : profile ? (
          <div className="grid-1fr-360">
            <div>
              <div className="card">
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>{profile.lawyer_name || profile.name}</h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>{profile.specialization}</p>
                <div style={{ marginTop: '16px' }}>
                  <p><strong>Location:</strong> {profile.location || '—'}</p>
                  <p><strong>Experience:</strong> {profile.experience || '—'} yrs</p>
                  <p><strong>Fees:</strong> ₹{profile.fees?.toLocaleString?.() || 'N/A'}</p>
                </div>
                {profile.reason && (
                  <div style={{ marginTop: '12px', padding: '12px', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
                    <strong>Why recommended:</strong>
                    <p style={{ marginTop: '8px' }}>{profile.reason}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="card">
                <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>Contact & Message</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Phone: {profile.phone || 'Not provided'}
                </p>

                {sendSuccess && <div className="alert alert-success" style={{ marginTop: '12px' }}>{sendSuccess}</div>}
                {sendError && <div className="alert alert-error" style={{ marginTop: '12px' }}>{sendError}</div>}

                <form onSubmit={handleSend} style={{ marginTop: '12px' }}>
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px' }}>Select Case (optional)</label>
                    <select value={selectedCase} onChange={e => setSelectedCase(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                      <option value="">None / General inquiry</option>
                      {cases.map(c => (
                        <option key={c.id || c._id} value={c.id || c._id}>
                          {`#${c.id || c._id} — ${String(c.description || '').slice(0, 80)}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px' }}>Message</label>
                    <textarea name="content" value={message.content} onChange={e => setMessage(prev => ({ ...prev, content: e.target.value }))} rows={5} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }} />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={sending} style={{ width: '100%' }}>
                    {sending ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div>No profile data</div>
        )}
      </div>
    </div>
  )
}
