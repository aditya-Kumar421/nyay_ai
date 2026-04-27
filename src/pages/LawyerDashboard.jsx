import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import FormInput from '../components/FormInput'
import api from '../api/axios'
import MessagesWidget from '../components/MessagesWidget'

const specializationOptions = [
  { value: 'criminal', label: 'Criminal Law' },
  { value: 'family', label: 'Family Law' },
  { value: 'property', label: 'Property Law' },
]

const courtOptions = [
  { value: 'Session Court', label: 'Session Court' },
  { value: 'District Court', label: 'District Court' },
  { value: 'High Court', label: 'High Court' },
  { value: 'Supreme Court', label: 'Supreme Court' },
]

const EMPTY_PROFILE = {
  specialization: '',
  location: '',
  fees: '',
  experience: '',
  court_of_practice: '',
  bar_council_id: '',
}

export default function LawyerDashboard() {
  const user = JSON.parse(localStorage.getItem('nyay_user') || '{}')
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState(EMPTY_PROFILE)
  const [editing, setEditing] = useState(false)
  const [creating, setCreating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/my-profile', { params: { user_id: user._id || user.id } })
      const p = data.profile || data
      setProfile(p)
      setForm({
        specialization: p.specialization || '',
        location: p.location || '',
        fees: p.fees || '',
        experience: p.experience || '',
        court_of_practice: p.court_of_practice || '',
        bar_council_id: p.bar_council_id || '',
      })
    } catch (err) {
      if (err.response?.status === 404) {
        setProfile(null)
        setCreating(true)
      } else {
        setError('Could not load profile.')
      }
    } finally {
      setLoading(false)
    }

  }

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
    setSuccess('')
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.specialization) { setError('Select a specialization.'); return }
    if (!form.location.trim()) { setError('Location is required.'); return }

    const feesNum = Number(form.fees)
    const expNum = Number(form.experience)
    if (!form.fees || Number.isNaN(feesNum) || feesNum < 5000 || feesNum > 5000000) { setError('Enter consultation fees between ₹5,000 and ₹5,000,000.'); return }
    if (form.experience === '' || Number.isNaN(expNum) || expNum < 0 || expNum > 20) { setError('Enter experience between 0 and 20 years.'); return }

    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const userId = user._id || user.id
      const payload = {
        specialization: form.specialization,
        location: form.location,
        fees: Number(form.fees),
        experience: Number(form.experience),
        court_of_practice: form.court_of_practice,
        bar_council_id: form.bar_council_id,
      }
      if (creating) {
        const { data } = await api.post('/create-profile', { ...payload, user_id: userId })
        setProfile(data.profile || data)
        setCreating(false)
      } else {
        const { data } = await api.put('/update-profile', payload, { params: { user_id: userId } })
        setProfile(data.profile || data)
        setEditing(false)
      }
      setSuccess('Profile saved successfully.')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile.')
    } finally {
      setSaving(false)
    }
  }

  function toggleVisibility() {
    if (!profile) return
    setProfile(prev => ({ ...prev, visible: !prev.visible }))
  }

  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="container" style={{ padding: '40px 24px', flex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <div className="section-label">Lawyer Portal</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, marginTop: '6px' }}>
            Welcome, {user.name?.split(' ')[0] || 'Counsel'}.
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>
            Manage your professional profile to appear in petitioner recommendations.
          </p>
        </div>

        <div className="grid-two" style={{ maxWidth: '900px' }}>
          {/* Profile card */}
          <div>
            <div className="card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 600 }}>
                  {profile ? 'Your Profile' : 'Create Profile'}
                </h2>
                {profile && !editing && (
                  <button
                    className="btn btn-outline"
                    style={{ padding: '7px 16px', fontSize: '0.82rem' }}
                    onClick={() => { setEditing(true); setSuccess(''); setError('') }}
                  >
                    Edit
                  </button>
                )}
              </div>

              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{ height: '40px', background: 'var(--bg-subtle)', borderRadius: '6px' }} />
                  ))}
                </div>
              ) : profile && !editing ? (
                /* View mode */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {[
                    { label: 'Specialization', value: profile.specialization },
                    { label: 'Location', value: profile.location },
                    { label: 'Court of Practice', value: profile.court_of_practice || 'Session Court' },
                    { label: 'Consultation Fee', value: profile.fees ? `₹${Number(profile.fees).toLocaleString()}` : '—' },
                    { label: 'Experience', value: profile.experience ? `${profile.experience} years` : '—' },
                    { label: 'Bar Council ID', value: profile.bar_council_id || '—' },
                  ].map(({ label, value }) => (
                    <div key={label} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '14px 0',
                      borderBottom: '1px solid var(--border)',
                      gap: '12px',
                    }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 600, textAlign: 'right' }}>{value || '—'}</span>
                    </div>
                  ))}
                </div>
              ) : (
                /* Edit / Create form */
                <form onSubmit={handleSave} noValidate>
                  {error && <div className="alert alert-error">{error}</div>}
                  {success && <div className="alert alert-success">{success}</div>}

                  <FormInput
                    label="Specialization"
                    type="select"
                    name="specialization"
                    value={form.specialization}
                    onChange={handleChange}
                    options={specializationOptions}
                    required
                  />
                  <FormInput
                    label="Location / City"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="New Delhi"
                    required
                  />
                  <FormInput
                    label="Court of Practice"
                    type="select"
                    name="court_of_practice"
                    value={form.court_of_practice}
                    onChange={handleChange}
                    options={courtOptions}
                  />
                  <FormInput
                    label="Bar Council ID"
                    name="bar_council_id"
                    value={form.bar_council_id}
                    onChange={handleChange}
                    placeholder="Bar Council Registration ID"
                  />
                  <div className="responsive-form-grid">
                    <FormInput
                      label="Consultation Fee (₹)"
                      type="number"
                      name="fees"
                      value={form.fees}
                      onChange={handleChange}
                      placeholder="5000"
                      min="5000"
                      max="5000000"
                      required
                    />
                    <FormInput
                      label="Experience (years)"
                      type="number"
                      name="experience"
                      value={form.experience}
                      onChange={handleChange}
                      placeholder="5"
                      min="0"
                      max="20"
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                    <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 1 }}>
                      {saving ? <><span className="spinner" /> Saving…</> : (creating ? 'Create Profile' : 'Save Changes')}
                    </button>
                    {!creating && (
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => { setEditing(false); setError(''); setSuccess('') }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}

              {success && !editing && (
                <div className="alert alert-success" style={{ marginTop: '16px' }}>{success}</div>
              )}
            </div>
          </div>

          {/* Right column — info/tips */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Account info */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>
                Account Details
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {[
                  { label: 'Name', value: user.name },
                  { label: 'Email', value: user.email },
                  { label: 'Phone', value: user.phone || '—' },
                  { label: 'Role', value: <span className="badge badge-gold">Lawyer</span> },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '11px 0',
                    borderBottom: '1px solid var(--border)',
                    gap: '12px',
                    alignItems: 'center',
                  }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{label}</span>
                    <span style={{ fontSize: '0.84rem', color: 'var(--text-primary)', fontWeight: 500 }}>{value || '—'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="card" style={{ padding: '20px', background: 'var(--gold-bg)', border: '1px solid rgba(184,149,42,0.2)' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gold)', marginBottom: '10px' }}>
                ✦ Profile tips
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  'Complete your profile to rank higher in recommendations',
                  'Accurate fees help petitioners filter by budget',
                  'Specialization directly affects your match score',
                ].map(tip => (
                  <li key={tip} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', paddingLeft: '14px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: 'var(--gold)' }}>·</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Visibility status */}
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '3px' }}>Profile Visibility</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {profile ? (profile.visible ? 'Visible to petitioners' : 'Hidden from petitioners') : 'Create a profile to go live'}
                  </p>
                </div>
                <div
                  onClick={toggleVisibility}
                  role="switch"
                  aria-checked={!!profile?.visible}
                  title={profile ? (profile.visible ? 'Click to hide profile' : 'Click to show profile') : 'Create a profile to go live'}
                  style={{
                    width: '36px', height: '20px',
                    background: profile?.visible ? 'var(--navy)' : 'var(--border)',
                    borderRadius: '999px',
                    position: 'relative',
                    transition: 'background 0.2s',
                    cursor: profile ? 'pointer' : 'default',
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '3px',
                    left: profile?.visible ? '19px' : '3px',
                    width: '14px', height: '14px',
                    background: '#fff',
                    borderRadius: '50%',
                    transition: 'left 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MessagesWidget />
    </div>
  // </div>
  )
}
