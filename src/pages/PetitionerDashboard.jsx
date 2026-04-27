import { useState } from 'react'
import Navbar from '../components/Navbar'
import CaseForm from '../components/CaseForm'
import ResultList from '../components/ResultList'
import api from '../api/axios'
import PetitionerNav from '../components/PetitionerNav'
import MessagesWidget from '../components/MessagesWidget'

export default function PetitionerDashboard() {
  const user = JSON.parse(localStorage.getItem('nyay_user') || '{}')
  const [form, setForm] = useState({ description: '', budget: '', location: '' })
  const [lawyers, setLawyers] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.description.trim()) { setError('Please describe your legal issue.'); return }
    if (!form.budget || Number(form.budget) <= 0) { setError('Please enter a valid budget.'); return }
    if (!form.location.trim()) { setError('Please enter your location.'); return }

    setLoading(true)
    setError('')
    setSearched(true)
    try {
      const { data } = await api.post('/recommend-lawyers', {
        description: form.description,
        budget: Number(form.budget),
        location: form.location,
      })
      setLawyers(data.lawyers || data.recommendations || data || [])

      // Persist this search as a case on petitioner profile (best-effort)
      try {
        const currentUserId = user._id || user.id
        if (currentUserId) {
          await api.post('/add-case', {
            user_id: currentUserId,
            description: form.description,
            budget: Number(form.budget),
            location: form.location,
          })
        }
      } catch (err) {
        // non-blocking: ignore save errors but log for debugging
        // console.warn('Failed to save case:', err)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not fetch recommendations. Please try again.')
      setLawyers([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="container" style={{ padding: '40px 24px', flex: 1 }}>
        {/* Page header */}
        <div style={{ marginBottom: '36px' }}>
          <div className="section-label">Petitioner Portal</div>
          <PetitionerNav active="dashboard" />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, marginTop: '6px' }}>
            Good {getGreeting()}, {user.name?.split(' ')[0] || 'there'}.
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>
            Describe your legal situation and we'll find the best-matched lawyers for you.
          </p>
        </div>

        <div className={searched ? 'grid-sidebar-lg' : 'centered-single'}>
          {/* Case form panel */}
          <div>
            <div className="card" style={{ padding: '28px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600, marginBottom: '6px' }}>
                Describe Your Case
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '22px' }}>
                More detail = better matches
              </p>
              <CaseForm
                form={form}
                onChange={handleChange}
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
              />
            </div>

            {/* Tips card */}
            <div className="card" style={{ marginTop: '16px', padding: '20px', background: 'var(--gold-bg)', border: '1px solid rgba(184,149,42,0.2)' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gold)', marginBottom: '10px' }}>
                💡 Tips for better results
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  'Mention the type of dispute (civil, criminal, property…)',
                  'Include key facts and timeline of events',
                  'Specify if you need urgent representation',
                ].map(tip => (
                  <li key={tip} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', paddingLeft: '14px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: 'var(--gold)' }}>·</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Results panel */}
          {searched && (
            <div>
              <div style={{ marginBottom: '18px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600 }}>
                  {loading ? 'Analysing your case…' : 'Recommended Lawyers'}
                </h2>
                {!loading && lawyers && (
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Ranked by compatibility with your case
                  </p>
                )}
              </div>

              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="card" style={{ padding: '24px', opacity: 0.6 }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--bg-subtle)', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ height: '14px', background: 'var(--bg-subtle)', borderRadius: '4px', marginBottom: '8px', width: '60%' }} />
                          <div style={{ height: '11px', background: 'var(--bg-subtle)', borderRadius: '4px', width: '35%' }} />
                        </div>
                      </div>
                      <div style={{ height: '5px', background: 'var(--bg-subtle)', borderRadius: '4px', marginTop: '20px' }} />
                      <div style={{ height: '52px', background: 'var(--bg-subtle)', borderRadius: '4px', marginTop: '14px' }} />
                    </div>
                  ))}
                </div>
              ) : (
                <ResultList lawyers={lawyers} />
              )}
            </div>
          )}
        </div>
      </div>
      <MessagesWidget mode="sender" />
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
