import { Link } from 'react-router-dom'

const courses = [
  { to: '/courses/kids',   icon: '⭐', title: 'Kids Karate', age: 'Ages 5 – 12',  color: '#f59e0b', desc: 'Build confidence, discipline, and motor skills through age-appropriate Shotokan training.' },
  { to: '/courses/teens',  icon: '⚡', title: 'Teen Karate', age: 'Ages 13 – 17', color: '#a78bfa', desc: 'Channel energy, develop focus, and build character through structured martial arts.' },
  { to: '/courses/adults', icon: '🔥', title: 'Adult Karate', age: 'Ages 18+',    color: '#f87171', desc: 'Transform fitness, relieve stress, and master self-defense techniques.' },
]

export default function Courses() {
  return (
    <div className="page-container courses-page-container" style={{
      paddingTop: '3rem',
      paddingBottom: '0rem',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 'calc(100vh - var(--nav-h))',
      boxSizing: 'border-box'
    }}>
      <style>{`
        #app-container:has(.courses-page-container) + footer {
          margin-top: 0 !important;
        }
      `}</style>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <p className="eyebrow">Training Programs</p>
        <h1 className="page-title">Our <span className="text-gold">Courses</span></h1>
        <p className="section-sub" style={{ maxWidth: 620, margin: '0 auto' }}>Whether you're 5 or 50, there's a program tailored for your age, fitness level, and goals.</p>
      </div>

      <div className="card-grid" style={{ gap: '2rem' }}>
        {courses.map(({ to, icon, title, age, color, desc }, idx) => (
          <div key={to} className={`card glass-glow course-card zoom-stagger-${idx + 1}`} style={{ padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden', cursor: 'pointer', background: 'rgba(11, 15, 25, 0.55)', border: `1px solid ${color}33`, backdropFilter: 'blur(16px)', transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, border-color 0.4s ease, background 0.4s ease' }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-12px) scale(1.04)';
              e.currentTarget.style.borderColor = '#f59e0b';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 25px rgba(245, 158, 11, 0.6)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.borderColor = color + '33';
              e.currentTarget.style.boxShadow = '';
            }}>
            <div className="card-glow-overlay" style={{ background: `radial-gradient(circle at 50% 0%, ${color}18, transparent 70%)` }} />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{icon}</div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.35rem', color: '#fff' }}>{title}</h2>
              <span style={{ display: 'inline-block', background: `${color}22`, color, border: `1px solid ${color}44`, borderRadius: '99px', padding: '0.2rem 0.75rem', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1.25rem' }}>{age}</span>
              <p style={{ color: 'var(--text-2)', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '1.75rem' }}>{desc}</p>
              <Link to={to} className="btn btn-gold" style={{ fontSize: '0.9rem' }}>Learn More →</Link>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '3.5rem',
        paddingBottom: '3.5rem'
      }} className="zoom-stagger-3">
        <Link to="/trial" className="btn btn-gold" style={{ padding: '0.9rem 2.5rem', fontSize: '1.05rem', fontWeight: 700, boxShadow: '0 4px 15px rgba(245, 158, 11, 0.15)' }}>
          Join Our Academy Today
        </Link>
      </div>
    </div>
  )
}
