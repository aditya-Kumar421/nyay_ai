import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import api from '../api/axios'
import FormInput from '../components/FormInput'

const roleOptions = [
  { value: 'petitioner', label: 'Petitioner — I need legal help' },
  { value: 'lawyer', label: 'Lawyer — I provide legal services' },
]

export default function Register() {
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    phone: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  function validate() {
    if (!form.name.trim()) return 'Name is required.'
    if (!form.email.includes('@')) return 'Enter a valid email address.'
    if (form.password.length < 6) return 'Password must be at least 6 characters.'
    if (!form.role) return 'Please select a role.'
    if (!form.phone.trim()) return 'Phone number is required.'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }

    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/signup', form)
      const user = data.user || data
      localStorage.setItem('nyay_user', JSON.stringify(user))
      const params = new URLSearchParams(location.search)
      const redirect = params.get('redirect')
      if (redirect) {
        navigate(redirect, { replace: true })
      } else {
        if (user.role === 'lawyer') navigate('/lawyer')
        else navigate('/petitioner')
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      {/* ── Left panel ── */}
      <div className="auth-panel-left">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '48px', textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', color: '#fff' }}>
              Nyay<span style={{ color: 'var(--gold-light)' }}>AI</span>
            </span>
          </Link>

          <h2 style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: '2.1rem', fontWeight: 700, lineHeight: 1.2, marginBottom: '20px' }}>
            Join the platform<br />
            <em style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>built for justice.</em>
          </h2>

          <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, fontSize: '0.9rem', maxWidth: '320px' }}>
            Whether you're seeking legal help or offering your expertise — Nyay AI is the bridge.
          </p>

          <div style={{ marginTop: '56px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              'Free to register',
              'Role-based dashboard',
              'Instant AI matching',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  width: '22px', height: '22px', borderRadius: '50%',
                  background: 'rgba(212,175,80,0.2)',
                  border: '1px solid rgba(212,175,80,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--gold-light)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
                <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="auth-panel-right">
        <div className="auth-form-box fade-in">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--navy)' }}>
              Nyay<span style={{ color: 'var(--gold)' }}>AI</span>
            </span>
          </Link>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, marginBottom: '6px' }}>
            Create account
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '28px' }}>
            Get started in less than 2 minutes.
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <FormInput
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
            <FormInput
              label="Email address"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
            <FormInput
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              required
            />
            <div className="responsive-form-grid">
              <FormInput
                label="Role"
                type="select"
                name="role"
                value={form.role}
                onChange={handleChange}
                options={roleOptions}
                required
              />
              <FormInput
                label="Phone"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="your phone number"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: '100%', marginTop: '8px' }}
            >
              {loading ? <><span className="spinner" /> Creating account…</> : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '22px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--gold)', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
