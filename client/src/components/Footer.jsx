import { Link } from 'react-router-dom'

export default function Footer() {
  const headingStyle = {
    color: '#fff',
    fontSize: '0.95rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '0.75rem'
  }

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>🥋</span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, letterSpacing: '0.5px' }}>
              Best <span className="text-gold">Karate</span> of India
            </h3>
          </div>
          <p style={{ color: 'var(--text-2)', fontSize: '0.82rem', lineHeight: '1.6', margin: 0 }}>
            Forging character. Building strength.<br />Pollachi, Tamil Nadu.
          </p>
        </div>

        <div className="footer-links" style={{ display: 'flex', flexDirection: 'column' }}>
          <h4 style={headingStyle}>Navigate</h4>
          <Link className="footer-link" to="/">Home</Link>
          <Link className="footer-link" to="/about">About</Link>
          <Link className="footer-link" to="/courses">Courses</Link>
          <Link className="footer-link" to="/belts">Belt System</Link>
          <Link className="footer-link" to="/achievements">Achievements</Link>
          <Link className="footer-link" to="/contact">Contact</Link>
        </div>

        <div className="footer-links" style={{ display: 'flex', flexDirection: 'column' }}>
          <h4 style={headingStyle}>Programs</h4>
          <Link className="footer-link" to="/courses/kids">Kids Karate</Link>
          <Link className="footer-link" to="/courses/teens">Teen Karate</Link>
          <Link className="footer-link" to="/courses/adults">Adult Karate</Link>
          <Link className="footer-link" to="/trial">Free Trial</Link>
        </div>

        <div className="footer-contact" style={{ display: 'flex', flexDirection: 'column' }}>
          <h4 style={headingStyle}>Contact</h4>
          <div className="footer-link" style={{ color: 'var(--text-2)', cursor: 'default' }}>
            📍 Pollachi, Tamil Nadu
          </div>
          <a className="footer-link footer-contact-link" href="tel:+919876543210">
            📞 +91 93448 57541
          </a>
          <a className="footer-link footer-contact-link" href="mailto:info@bestkarateofindia.com">
            ✉️ info@bestkarateofindia.com
          </a>
          <div className="footer-link" style={{ color: 'var(--text-2)', opacity: 0.8, cursor: 'default', fontSize: '0.78rem', marginTop: '0.25rem' }}>
            Mon – Sat: 5:00 AM – 9:00 PM
          </div>
        </div>
      </div>

      <div className="footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <p style={{ margin: 0 }}>© {new Date().getFullYear()} Best Karate of India. All rights reserved.</p>

      </div>
    </footer>
  )
}
