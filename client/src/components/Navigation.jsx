import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile drawer and dropdown on route change
  useEffect(() => {
    setMobileOpen(false)
    setDropdownOpen(false)
  }, [location])

  const handleCoursesClick = (e) => {
    if (window.innerWidth <= 768) {
      // Toggle dropdown open state on mobile instead of immediately blocking navigation
      // (so they can tap to open, then tap again or tap sublinks)
      setDropdownOpen(!dropdownOpen)
    }
  }

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      {/* Brand logo & text */}
      <NavLink to="/" className="nav-brand">
        <div className="brand-logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
        <div className="brand-text">
          <h2 className="brand-title" style={{ margin: 0, fontWeight: 700, color: '#fff' }}>Best Karate Of India</h2>
          <p className="brand-sub" style={{ margin: 0, fontWeight: 600 }}>BKI</p>
        </div>
      </NavLink>

      {/* Navigation links */}
      <ul className={`nav-links${mobileOpen ? ' open' : ''}`}>
        <li>
          <NavLink to="/" end className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            About Us
          </NavLink>
        </li>
        <li className={`dropdown-container${dropdownOpen ? ' open' : ''}`}>
          <NavLink
            to="/courses"
            onClick={handleCoursesClick}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            Courses
          </NavLink>
          <ul className="dropdown-menu">
            <li>
              <NavLink to="/courses/kids" className="dropdown-link">
                Kids Karate
              </NavLink>
            </li>
            <li>
              <NavLink to="/courses/teens" className="dropdown-link">
                Teen Karate
              </NavLink>
            </li>
            <li>
              <NavLink to="/courses/adults" className="dropdown-link">
                Adult Karate
              </NavLink>
            </li>
          </ul>
        </li>
        <li>
          <NavLink to="/belts" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            Belt System
          </NavLink>
        </li>
        <li>
          <NavLink to="/achievements" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            Achievements
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            Contact
          </NavLink>
        </li>

        {/* Mobile only CTA */}
        <li className="mobile-cta-row">
          <Link to="/trial" className="btn btn-gold" style={{ width: '100%', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            Book Free Trial
          </Link>
        </li>
      </ul>

      {/* Desktop only CTA & Admin Link */}
      <div className="nav-cta" style={{ alignItems: 'center', gap: '1.25rem' }}>
        <Link to="/trial" className="btn btn-gold">
          Book Free Trial
        </Link>
        <Link to="/admin" style={{ color: 'var(--text-2)', opacity: 0.5, display: 'flex', transition: 'opacity 0.2s, color 0.2s' }} onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = 'var(--gold)'; }} onMouseLeave={e => { e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.color = 'var(--text-2)'; }} title="Admin Console">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </Link>
      </div>

      {/* Hamburger icon */}
      <button
        className={`nav-hamburger${mobileOpen ? ' active' : ''}`}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
        aria-expanded={mobileOpen}
      >
        <span />
        <span />
        <span />
      </button>
    </nav>
  )
}
