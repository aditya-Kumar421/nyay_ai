import { useNavigate, Link } from 'react-router-dom'

const ScalesIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v18M4 6l8-3 8 3M4 6c0 3.31 1.79 6 4 6s4-2.69 4-6M16 6c0 3.31-1.79 6-4 6s-4-2.69-4-6"/>
    <path d="M4 18h16"/>
  </svg>
)

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
  </svg>
)

export default function Navbar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('nyay_user') || 'null')

  function handleLogout() {
    localStorage.removeItem('nyay_user')
    navigate('/')
  }

  return (
    <nav style={{
      background: 'var(--bg-card)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
      }}>
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <span style={{ color: 'var(--gold)', display: 'flex' }}>
            <ScalesIcon />
          </span>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1.25rem',
            color: 'var(--navy)',
            letterSpacing: '-0.01em',
          }}>
            Nyay<span style={{ color: 'var(--gold)' }}>AI</span>
          </span>
        </Link>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <>
              <span style={{
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                fontWeight: 500,
              }}>
                {user.name || user.email}
                <span className="badge badge-navy" style={{ marginLeft: '8px' }}>
                  {user.role}
                </span>
              </span>
              <button className="btn btn-ghost" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <LogoutIcon /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Login</Link>
              <Link to="/book-demo" className="btn btn-gold">Book Demo</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
