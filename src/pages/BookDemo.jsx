import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import FormInput from '../components/FormInput'
import Navbar from '../components/Navbar'

export default function BookDemo() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Please enter your name.'); return }
    if (!form.email.includes('@')) { setError('Please enter a valid email.'); return }
    if (!form.message.trim()) { setError('Please tell us a bit about your use case.'); return }

    setLoading(true)
    setError('')
    try {
      await api.post('/book-demo', form)
      setSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-wrapper">
      <Navbar />

      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        position: 'relative',
      }}>
        {/* bg dots */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)',
          backgroundSize: '32px 32px',
          opacity: 0.5,
          zIndex: 0,
        }} />

        <div className="grid-1fr-480" style={{ position: 'relative', zIndex: 1 }}>
          {/* Left — pitch */}
          <div style={{ paddingTop: '12px' }}>
            <div className="section-label">Book a Demo</div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              fontWeight: 700,
              marginTop: '12px',
              lineHeight: 1.15,
              marginBottom: '20px',
            }}>
              See Nyay AI<br />
              <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>in action.</em>
            </h1>

            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: '380px', marginBottom: '36px' }}>
              Whether you're a law firm, LegalTech integrator, or enterprise with legal needs — we'll walk you through how Nyay AI can transform your operations.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { title: 'Live product walkthrough', desc: '30-minute session tailored to your use case' },
                { title: 'API integration overview', desc: 'See how to plug Nyay AI into your existing systems' },
                { title: 'Custom deployment options', desc: 'On-premise, cloud, or hybrid — we adapt to you' },
              ].map(item => (
                <div key={item.title} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '36px', height: '36px', flexShrink: 0,
                    background: 'var(--navy)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold-light)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '3px' }}>{item.title}</p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div>
            {submitted ? (
              <div className="card fade-in" style={{ padding: '40px 32px', textAlign: 'center' }}>
                <div style={{
                  width: '60px', height: '60px', borderRadius: '50%',
                  background: '#F0FDF4', border: '2px solid #86EFAC',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>
                  Request received!
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '28px' }}>
                  Thank you, <strong>{form.name}</strong>. Our team will reach out to <strong>{form.email}</strong> within one business day to schedule your demo.
                </p>
                <Link to="/" className="btn btn-primary">
                  Back to Home
                </Link>
              </div>
            ) : (
              <div className="card" style={{ padding: '32px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600, marginBottom: '6px' }}>
                  Request a Demo
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
                  Fill in your details and we'll be in touch shortly.
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
                    label="Work Email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your.email@lawfirm.com"
                    required
                  />
                  <FormInput
                    label="Tell us about your use case"
                    type="textarea"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Let us know more about your needs…"
                    rows={5}
                    required
                  />

                  <button
                    type="submit"
                    className="btn btn-gold btn-lg"
                    disabled={loading}
                    style={{ width: '100%', marginTop: '4px' }}
                  >
                    {loading ? <><span className="spinner" /> Submitting…</> : 'Book My Demo →'}
                  </button>
                </form>

                <p style={{ marginTop: '16px', fontSize: '0.76rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  No credit card required · Response within 24 hours
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
