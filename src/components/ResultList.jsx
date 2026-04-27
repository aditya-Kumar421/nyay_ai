import LawyerCard from './LawyerCard'

export default function ResultList({ lawyers }) {
  console.log('Rendering ResultList with lawyers:', lawyers)
  if (!lawyers || lawyers.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '48px 24px',
        color: 'var(--text-muted)',
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="1.5" style={{ margin: '0 auto 16px' }}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
          No lawyers found
        </p>
        <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>
          Try adjusting your budget or location and search again.
        </p>
      </div>
    )
  }

  return (
    <div>
      <p style={{
        fontSize: '0.82rem',
        color: 'var(--text-muted)',
        marginBottom: '16px',
        fontWeight: 500,
      }}>
        {lawyers.length} lawyer{lawyers.length !== 1 ? 's' : ''} matched your case
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {lawyers.map((lawyer, i) => (
          <LawyerCard key={lawyer.user_id || lawyer.id || i} lawyer={lawyer} rank={i} />
        ))}
      </div>
    </div>
  )
}
