import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import FormInput from '../components/FormInput'
import api from '../api/axios'
import PetitionerNav from '../components/PetitionerNav'

const STATUS_COLORS = {
  open:     { bg: '#F0FDF4', color: '#166534', border: '#86EFAC' },
  pending:  { bg: '#FFFBEB', color: '#92400E', border: '#FCD34D' },
  assigned: { bg: '#EFF6FF', color: '#1E40AF', border: '#93C5FD' },
  closed:   { bg: '#F5F0E8', color: '#5A627A', border: '#D4C9B8' },
}

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status?.toLowerCase()] || STATUS_COLORS.open
  return (
    <span style={{
      padding: '3px 10px',
      borderRadius: '999px',
      fontSize: '0.72rem',
      fontWeight: 700,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      background: s.bg,
      color: s.color,
      border: `1px solid ${s.border}`,
    }}>
      {status || 'open'}
    </span>
  )
}

const EMPTY_FORM = { description: '', budget: '', location: '' }

export default function MyCases() {
  const user = JSON.parse(localStorage.getItem('nyay_user') || '{}')
  const userId = user._id || user.id

  const [cases, setCases]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [adding, setAdding]     = useState(false)
  const [addError, setAddError] = useState('')
  const [addSuccess, setAddSuccess] = useState('')

  useEffect(() => { fetchCases() }, [])

  async function fetchCases() {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/my-cases', { params: { user_id: userId } })
      setCases(Array.isArray(data) ? data : data.cases || [])
    } catch (err) {
      setError('Could not load your cases. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setAddError('')
  }

  async function handleAddCase(e) {
    e.preventDefault()
    if (!form.description.trim()) { setAddError('Description is required.'); return }
    if (!form.budget || Number(form.budget) <= 0) { setAddError('Enter a valid budget.'); return }
    if (!form.location.trim()) { setAddError('Location is required.'); return }

    setAdding(true)
    setAddError('')
    setAddSuccess('')
    try {
      const { data } = await api.post('/add-case', {
        user_id: userId,
        description: form.description,
        budget: Number(form.budget),
        location: form.location,
      })
      setAddSuccess('Case added successfully!')
      setForm(EMPTY_FORM)
      setShowForm(false)
      await fetchCases()
    } catch (err) {
      setAddError(err.response?.data?.message || 'Failed to add case.')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="container" style={{ padding: '40px 24px', flex: 1 }}>
        <div className="section-label">Petitioner Portal</div>
        <PetitionerNav active="my-cases" />

        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700 }}>
              My Cases
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
              Track all your submitted legal cases.
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => { setShowForm(v => !v); setAddError(''); setAddSuccess('') }}
          >
            {showForm ? '✕ Cancel' : '+ Add New Case'}
          </button>
        </div>

        {addSuccess && <div className="alert alert-success">{addSuccess}</div>}

        {/* Add Case Form */}
        {showForm && (
          <div className="card fade-in" style={{ padding: '28px', marginBottom: '28px', borderLeft: '3px solid var(--gold)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '20px' }}>
              Add New Case
            </h2>
            {addError && <div className="alert alert-error">{addError}</div>}
            <form onSubmit={handleAddCase} noValidate>
              <FormInput
                label="Describe your legal issue"
                type="textarea"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="e.g. Property dispute with neighbour…"
                rows={4}
                required
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <FormInput
                  label="Budget (₹)"
                  type="number"
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  placeholder="5000"
                  min="0"
                  required
                />
                <FormInput
                  label="Location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Delhi"
                  required
                />
              </div>
              <button type="submit" className="btn btn-gold" disabled={adding} style={{ minWidth: '140px' }}>
                {adding ? <><span className="spinner" /> Submitting…</> : 'Submit Case'}
              </button>
            </form>
          </div>
        )}

        {/* Cases list */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="card" style={{ padding: '24px', opacity: 0.5 }}>
                <div style={{ height: '14px', background: 'var(--bg-subtle)', borderRadius: '4px', width: '40%', marginBottom: '10px' }} />
                <div style={{ height: '11px', background: 'var(--bg-subtle)', borderRadius: '4px', width: '70%' }} />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : cases.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 24px' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="1.5" style={{ margin: '0 auto 16px' }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
            </svg>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>No cases yet</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              Click "Add New Case" to file your first case.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {cases.map((c, i) => (
              <div key={c.id || i} className="card fade-in" style={{ padding: '22px 24px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                      #{c.id}
                    </span>
                    <StatusBadge status={c.status} />
                    {c.assigned_lawyer_id && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Lawyer #{c.assigned_lawyer_id}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.55, marginBottom: '10px' }}>
                    {c.description}
                  </p>
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      {c.location}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                      ₹{Number(c.budget).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
