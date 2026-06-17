import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  const saved = localStorage.getItem('bki-theme')
  if (saved) return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function Navigation() {
  const [scrolled,      setScrolled]      = useState(false)
  const [mobileOpen,    setMobileOpen]    = useState(false)
  const [dropdownOpen,  setDropdownOpen]  = useState(false)
  const [theme,         setTheme]         = useState(getInitialTheme)
  const location = useLocation()

  /* Apply theme to <html> on mount + whenever it changes */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('bki-theme', theme)
  }, [theme])

  /* Scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Close mobile drawer on route change */
  useEffect(() => {
    setMobileOpen(false)
    setDropdownOpen(false)
  }, [location])

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  const handleCoursesClick = () => {
    if (window.innerWidth <= 768) setDropdownOpen(d => !d)
  }

  const isDark = theme === 'dark'

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      {/* Brand */}
      <NavLink to="/" className="nav-brand">
        <div className="brand-logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
        <div className="brand-text">
          <h2 className="brand-title" style={{ margin: 0, fontWeight: 700 }}>Best Karate Of India</h2>
          <p className="brand-sub" style={{ margin: 0, fontWeight: 600 }}>BKI</p>
        </div>
      </NavLink>

      {/* Nav links */}
      <ul className={`nav-links${mobileOpen ? ' open' : ''}`}>
        <li><NavLink to="/" end className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>Home</NavLink></li>
        <li><NavLink to="/about" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>About Us</NavLink></li>
        <li className={`dropdown-container${dropdownOpen ? ' open' : ''}`}>
          <NavLink to="/courses" onClick={handleCoursesClick} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            Courses
          </NavLink>
          <ul className="dropdown-menu">
            <li><NavLink to="/courses/kids"   className="dropdown-link">Kids Karate</NavLink></li>
            <li><NavLink to="/courses/teens"  className="dropdown-link">Teen Karate</NavLink></li>
            <li><NavLink to="/courses/adults" className="dropdown-link">Adult Karate</NavLink></li>
          </ul>
        </li>
        <li><NavLink to="/belts"        className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>Belt System</NavLink></li>
        <li><NavLink to="/achievements" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>Achievements</NavLink></li>
        <li><NavLink to="/contact"      className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>Contact</NavLink></li>

        {/* Mobile CTA */}
        <li className="mobile-cta-row">
          <Link to="/trial" className="btn btn-gold" style={{ width: '100%', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            Book Free Trial
          </Link>
        </li>
      </ul>

      {/* Desktop CTA + Theme toggle + Admin */}
      <div className="nav-cta" style={{ alignItems: 'center', gap: '1rem' }}>
        <Link to="/trial" className="btn btn-gold">Book Free Trial</Link>

        {/* ── Dark / Light Mode Toggle ── */}
        <button
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Light Mode' : 'Dark Mode'}
          style={{
            background: 'none',
            border: '1.5px solid var(--border)',
            borderRadius: '50%',
            width: 36,
            height: 36,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-1)',
            transition: 'border-color 0.2s, background 0.2s, transform 0.3s',
            flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.transform = 'rotate(20deg)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'rotate(0deg)' }}
        >
          {isDark ? (
            /* Sun icon — visible in dark mode */
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            /* Moon icon — visible in light mode */
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>


      </div>

      {/* Hamburger */}
      <button
        className={`nav-hamburger${mobileOpen ? ' active' : ''}`}
        onClick={() => setMobileOpen(m => !m)}
        aria-label="Toggle navigation"
        aria-expanded={mobileOpen}
      >
        <span /><span /><span />
      </button>
    </nav>
  )
}
