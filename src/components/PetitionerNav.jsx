import { Link } from 'react-router-dom'

const tabs = [
  { key: 'dashboard',      label: 'AI Recommend',    to: '/petitioner' },
  { key: 'search-lawyers', label: 'Search Lawyers',  to: '/search-lawyers' },
  { key: 'my-cases',       label: 'My Cases',        to: '/my-cases' },
]

export default function PetitionerNav({ active }) {
  return (
    <nav style={{
      display: 'flex',
      gap: '4px',
      borderBottom: '1px solid var(--border)',
      marginBottom: '28px',
      marginTop: '12px',
    }}>
      {tabs.map(tab => {
        const isActive = tab.key === active
        return (
          <Link
            key={tab.key}
            to={tab.to}
            style={{
              padding: '9px 18px',
              fontSize: '0.875rem',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--navy)' : 'var(--text-muted)',
              borderBottom: isActive ? '2px solid var(--navy)' : '2px solid transparent',
              marginBottom: '-1px',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
