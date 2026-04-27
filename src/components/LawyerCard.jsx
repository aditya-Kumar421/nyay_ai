import { Link } from 'react-router-dom'

const StarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--gold)" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)

const LocationIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)

const BriefcaseIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
  </svg>
)

const RupeeIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12M6 8h12M6 13l7.5 8L20 13M6 8a5 5 0 0 0 5 5"/>
  </svg>
)

function ScoreBar({ score }) {
  const pct = Math.round(score * 25)
  return (
    <div style={{ marginTop: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Match Score
        </span>
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gold)' }}>{pct}%</span>
      </div>
      <div style={{
        height: '5px',
        background: 'var(--bg-subtle)',
        borderRadius: '999px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: 'linear-gradient(90deg, var(--gold) 0%, var(--gold-light) 100%)',
          borderRadius: '999px',
          transition: 'width 0.6s ease',
        }} />
      </div>
    </div>
  )
}

export default function LawyerCard({ lawyer, rank }) {
  const {
    lawyer_name,
    specialization,
    location,
    fees,
    match_score,
    reason,
    experience,
    court_of_practice,
  } = lawyer

  const profileId = lawyer.user_id || lawyer._id || lawyer.id || ''

  return (
    <Link to={`/my-profile?user_id=${profileId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="card fade-in" style={{
        position: 'relative',
        padding: '24px',
        animation: `fadeIn 0.4s ease ${rank * 0.08}s both`,
      }}>
      {rank === 0 && (
        <div style={{
          position: 'absolute',
          top: '-1px',
          right: '20px',
          background: 'var(--gold)',
          color: '#fff',
          fontSize: '0.68rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          padding: '3px 10px',
          borderRadius: '0 0 6px 6px',
        }}>
          Best Match
        </div>
      )}

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div>
          {/* Avatar initial */}
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'var(--navy)',
            color: '#fff',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
          }}>
            {lawyer_name?.charAt(0)?.toUpperCase() || 'L'}
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '4px' }}>
            {lawyer_name || 'Lawyer'}
          </h3>
          <span className="badge badge-gold">{specialization || 'General Practice'}</span>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', marginBottom: '4px' }}>
            <StarIcon />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>4.8</span>
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--navy)' }}>
            ₹{fees?.toLocaleString() || 'N/A'}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>per consultation</div>
        </div>
      </div>

      {/* Meta chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '16px' }}>
        {location && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <LocationIcon /> {location}
          </span>
        )}
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <BriefcaseIcon /> {court_of_practice || 'District Court'}
        </span>
        {experience && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <BriefcaseIcon /> {experience} yrs exp
          </span>
        )}
        {lawyer.phone && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <RupeeIcon /> {lawyer.phone}
          </span>
        )}
      </div>

      {/* Match bar */}
      {match_score !== undefined && <ScoreBar score={match_score} />}

      {/* Reason */}
      {reason && (
        <div style={{
          marginTop: '14px',
          padding: '12px 14px',
          background: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-sm)',
          borderLeft: '3px solid var(--gold)',
        }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            <strong style={{ color: 'var(--navy)', fontWeight: 600 }}>Why recommended: </strong>
            {reason}
          </p>
        </div>
      )}
    </div>
    </Link>
  )
}
