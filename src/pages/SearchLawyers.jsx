import { useState } from 'react'
import Navbar from '../components/Navbar'
import FormInput from '../components/FormInput'
import ResultList from '../components/ResultList'
import PetitionerNav from '../components/PetitionerNav'
import api from '../api/axios'

const specializationOptions = [
  { value: 'criminal',      label: 'Criminal Law' },
  { value: 'family',        label: 'Family Law' },
  { value: 'property',      label: 'Property Law' },
]

const EMPTY_FILTERS = {
  specialization: '',
  location: '',
  min_experience: '',
  max_fees: '',
  min_rating: '',
}

export default function SearchLawyers() {
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [lawyers, setLawyers] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [searched, setSearched] = useState(false)

  function handleChange(e) {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  function buildParams() {
    const p = {}
    if (filters.specialization) p.specialization  = filters.specialization
    if (filters.location)       p.location        = filters.location
    if (filters.min_experience) p.min_experience  = Number(filters.min_experience)
    if (filters.max_fees)       p.max_fees        = Number(filters.max_fees)
    if (filters.min_rating)     p.min_rating      = Number(filters.min_rating)
    return p
  }

  async function handleSearch(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSearched(true)
    try {
      const { data } = await api.get('/search-lawyers', { params: buildParams() })
      setLawyers(Array.isArray(data) ? data : data.lawyers || [])
    } catch (err) {
      setError('Search failed. Please try again.')
      setLawyers([])
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setFilters(EMPTY_FILTERS)
    setLawyers(null)
    setSearched(false)
    setError('')
  }

  const hasFilters = Object.values(filters).some(v => v !== '')

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="container" style={{ padding: '40px 24px', flex: 1 }}>
        <div className="section-label">Petitioner Portal</div>
        <PetitionerNav active="search-lawyers" />

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, marginBottom: '6px' }}>
          Search Lawyers
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '28px' }}>
          Filter by specialization, location, experience, fees, or rating. All fields are optional.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '28px', alignItems: 'start' }}>
          {/* Filter panel */}
          <div className="card" style={{ padding: '24px', position: 'sticky', top: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600 }}>Filters</h2>
              {hasFilters && (
                <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: '0.78rem' }} onClick={handleReset}>
                  Reset
                </button>
              )}
            </div>

            <form onSubmit={handleSearch} noValidate>
              {error && <div className="alert alert-error">{error}</div>}

              <FormInput
                label="Specialization"
                type="select"
                name="specialization"
                value={filters.specialization}
                onChange={handleChange}
                options={specializationOptions}
              />
              <FormInput
                label="Location"
                name="location"
                value={filters.location}
                onChange={handleChange}
                placeholder="Delhi, Mumbai…"
              />

              <div className="divider" style={{ margin: '16px 0' }} />

              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
                Advanced
              </p>

              <FormInput
                label="Min. Experience (years)"
                type="number"
                name="min_experience"
                value={filters.min_experience}
                onChange={handleChange}
                placeholder="e.g. 3"
                min="0"
              />
              <FormInput
                label="Max. Fees (₹)"
                type="number"
                name="max_fees"
                value={filters.max_fees}
                onChange={handleChange}
                placeholder="e.g. 5000"
                min="0"
              />
              <FormInput
                label="Min. Rating"
                type="number"
                name="min_rating"
                value={filters.min_rating}
                onChange={handleChange}
                placeholder="e.g. 4.0"
                min="0"
              />

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', marginTop: '4px' }}
              >
                {loading ? <><span className="spinner" /> Searching…</> : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                    Search Lawyers
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results */}
          <div>
            {!searched ? (
              <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-muted)' }}>
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="1.2" style={{ margin: '0 auto 16px' }}>
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
                  Set your filters and search
                </p>
                <p style={{ fontSize: '0.82rem', marginTop: '6px' }}>
                  All filters are optional — search with none to see all lawyers.
                </p>
              </div>
            ) : loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} className="card" style={{ padding: '24px', opacity: 0.5 }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--bg-subtle)', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ height: '14px', background: 'var(--bg-subtle)', borderRadius: '4px', marginBottom: '8px', width: '55%' }} />
                        <div style={{ height: '11px', background: 'var(--bg-subtle)', borderRadius: '4px', width: '30%' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ResultList lawyers={lawyers} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
