import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
    title: 'AI-Powered Matching',
    desc: 'Our model analyses your case description and matches you with the most relevant legal specialists.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: 'Fast & Transparent',
    desc: 'Get ranked recommendations in seconds — with match scores and clear reasoning for each result.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Verified Professionals',
    desc: 'Every lawyer on the platform is verified with documented specialisation and experience.',
  },
]

const stats = [
  { value: '2,400+', label: 'Cases Resolved' },
  { value: '380+', label: 'Verified Lawyers' },
  { value: '94%', label: 'Match Accuracy' },
  { value: '18 States', label: 'Coverage' },
]

export default function Landing() {
  return (
    <div className="page-wrapper">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section style={{
        padding: '100px 24px 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* subtle background grid */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)',
          backgroundSize: '36px 36px',
          opacity: 0.6,
          zIndex: 0,
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-label fade-in" style={{ animationDelay: '0s' }}>
            Legal Intelligence Platform
          </div>

          <h1 className="fade-in" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            fontWeight: 700,
            color: 'var(--navy)',
            maxWidth: '720px',
            margin: '16px auto 0',
            lineHeight: 1.12,
            letterSpacing: '-0.02em',
            animationDelay: '0.1s',
          }}>
            Find the Right Lawyer{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>with Ease</em>
          </h1>

          <p className="fade-in" style={{
            marginTop: '24px',
            fontSize: '1.05rem',
            color: 'var(--text-secondary)',
            maxWidth: '520px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.7,
            animationDelay: '0.18s',
          }}>
            Describe your legal issue, set your budget, and our AI will connect you with the most suitable verified lawyer in India — instantly.
          </p>

          <div className="fade-in" style={{
            display: 'flex',
            gap: '14px',
            justifyContent: 'center',
            marginTop: '40px',
            flexWrap: 'wrap',
            animationDelay: '0.26s',
          }}>
            <Link to="/login" className="btn btn-primary btn-lg">
              Get Started
            </Link>
            <Link to="/book-demo" className="btn btn-outline btn-lg">
              Book a Demo
            </Link>
          </div>

          {/* Trust note */}
          <p className="fade-in" style={{
            marginTop: '24px',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            animationDelay: '0.34s',
          }}>
            No upfront payment · Session-based · Data encrypted
          </p>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────── */}
      <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        <div className="container grid-four" style={{ padding: '0 24px' }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              textAlign: 'center',
              padding: '28px 16px',
              borderRight: i < stats.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                fontWeight: 700,
                color: 'var(--navy)',
                lineHeight: 1,
              }}>{s.value}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px', fontWeight: 500 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section style={{ padding: '80px 24px' }}>
          <div className="container">
          <div className="section-label" style={{ textAlign: 'center' }}>How It Works</div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            fontWeight: 600,
            textAlign: 'center',
            margin: '12px auto 48px',
            maxWidth: '480px',
          }}>
            Three steps to your legal solution
          </h2>

          <div className="grid-three">
            {[
              { num: '01', title: 'Register & Describe', desc: 'Create an account as a petitioner and describe your legal issue in plain language.' },
              { num: '02', title: 'AI Analyses', desc: 'Our model processes your case, budget, and location to identify the best matching lawyers.' },
              { num: '03', title: 'Connect', desc: 'Browse your ranked results, compare profiles, fees, and reach out directly.' },
            ].map((step) => (
              <div key={step.num} className="card" style={{ padding: '28px', position: 'relative' }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '3rem',
                  fontWeight: 700,
                  color: 'var(--border)',
                  lineHeight: 1,
                  marginBottom: '16px',
                  userSelect: 'none',
                }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>{step.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section style={{ padding: '20px 24px 80px', background: 'var(--bg-subtle)' }}>
          <div className="container">
          <div className="grid-three">
            {features.map((f) => (
              <div key={f.title} className="card" style={{ padding: '24px' }}>
                <div style={{ color: 'var(--gold)', marginBottom: '14px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ fontSize: '0.845rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '560px' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 3vw, 2.1rem)',
            fontWeight: 700,
            marginBottom: '16px',
          }}>
            Justice should be <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>accessible</em>
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.7 }}>
            Join thousands of petitioners who found the right legal representation through Nyay AI.
          </p>
          <Link to="/register" className="btn btn-gold btn-lg">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '28px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--navy)', fontSize: '1rem' }}>
            Nyay<span style={{ color: 'var(--gold)' }}>AI</span>
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} NyayAI. Built with purpose.
          </span>
        </div>
      </footer>
    </div>
  )
}
