import { Link } from 'react-router-dom'

function CoursePage({ title, tag, color, icon, age, schedule, highlights, description }) {
  return (
    <div className="page-container course-detail-page-container" style={{
      paddingTop: '3rem',
      paddingBottom: '0rem',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 'calc(100vh - var(--nav-h))',
      boxSizing: 'border-box'
    }}>
      <style>{`
        #app-container:has(.course-detail-page-container) + footer {
          margin-top: 0 !important;
        }
      `}</style>
      <div className="slide-left" style={{ marginBottom: '3rem' }}>
        <span style={{ display: 'inline-block', background: `${color}22`, color, border: `1px solid ${color}44`, borderRadius: '99px', padding: '0.25rem 0.85rem', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>{tag}</span>
        <h1 className="page-title">{icon} {title}</h1>
        <p style={{ color: 'var(--text-2)', marginTop: '0.5rem', fontSize: '1rem' }}>Age Group: <strong style={{ color }}>{age}</strong></p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Description */}
        <div className="card glass-glow zoom-stagger-1" style={{
          padding: '2rem',
          background: 'rgba(11, 15, 25, 0.55)',
          border: `1px solid ${color}66`,
          backdropFilter: 'blur(16px)',
          boxShadow: `0 10px 30px rgba(0, 0, 0, 0.45), 0 0 15px ${color}15`,
          transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, border-color 0.4s ease'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-10px) scale(1.03)';
          e.currentTarget.style.borderColor = '#f59e0b';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.55), 0 0 25px rgba(245, 158, 11, 0.6)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.borderColor = `${color}66`;
          e.currentTarget.style.boxShadow = `0 10px 30px rgba(0, 0, 0, 0.45), 0 0 15px ${color}15`;
        }}>
          <div className="card-glow-overlay" style={{ background: `radial-gradient(circle at 50% 0%, ${color}10, transparent 70%)` }} />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 className="text-gold" style={{ marginBottom: '1rem' }}>Program Overview</h2>
            {description.map((p, i) => <p key={i} style={{ color: 'var(--text-2)', marginBottom: '0.75rem', lineHeight: 1.7 }}>{p}</p>)}
          </div>
        </div>

        {/* Highlights */}
        <div className="card glass-glow zoom-stagger-2" style={{
          padding: '2rem',
          background: 'rgba(11, 15, 25, 0.55)',
          border: `1px solid ${color}66`,
          backdropFilter: 'blur(16px)',
          boxShadow: `0 10px 30px rgba(0, 0, 0, 0.45), 0 0 15px ${color}15`,
          transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, border-color 0.4s ease'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-10px) scale(1.03)';
          e.currentTarget.style.borderColor = '#f59e0b';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.55), 0 0 25px rgba(245, 158, 11, 0.6)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.borderColor = `${color}66`;
          e.currentTarget.style.boxShadow = `0 10px 30px rgba(0, 0, 0, 0.45), 0 0 15px ${color}15`;
        }}>
          <div className="card-glow-overlay" style={{ background: `radial-gradient(circle at 50% 0%, ${color}10, transparent 70%)` }} />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 className="text-gold" style={{ marginBottom: '1.5rem' }}>What You'll Learn</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {highlights.map(h => (
                <li key={h} style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span className="text-gold" style={{ fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <span style={{ color: 'var(--text-2)', fontSize: '0.9rem' }}>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Schedule */}
        <div className="card glass-glow zoom-stagger-3" style={{
          padding: '2rem',
          background: 'rgba(11, 15, 25, 0.55)',
          border: `1px solid ${color}66`,
          backdropFilter: 'blur(16px)',
          boxShadow: `0 10px 30px rgba(0, 0, 0, 0.45), 0 0 15px ${color}15`,
          transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, border-color 0.4s ease'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-10px) scale(1.03)';
          e.currentTarget.style.borderColor = '#f59e0b';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.55), 0 0 25px rgba(245, 158, 11, 0.6)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.borderColor = `${color}66`;
          e.currentTarget.style.boxShadow = `0 10px 30px rgba(0, 0, 0, 0.45), 0 0 15px ${color}15`;
        }}>
          <div className="card-glow-overlay" style={{ background: `radial-gradient(circle at 50% 0%, ${color}10, transparent 70%)` }} />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 className="text-gold" style={{ marginBottom: '1.25rem' }}>Class Schedule</h2>
            {schedule.map(({ label, time }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: 'var(--text-2)', fontSize: '0.9rem' }}>🗓 {label}</span>
                <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '3.5rem',
        paddingBottom: '3.5rem'
      }}>
        <Link to="/trial" className="btn btn-gold" style={{ fontSize: '1rem', padding: '0.9rem 2rem' }}>Book a Free Trial →</Link>
      </div>
    </div>
  )
}

export function CourseKids() {
  return <CoursePage
    title="Kids Karate"
    tag="🌟 For Children"
    color="#f59e0b"
    icon="⭐"
    age="5 – 12 years"
    description={[
      "Our Kids Karate program is specially designed for young learners. Using fun, age-appropriate drills and games, we introduce children to the core principles of Shotokan Karate.",
      "Every class builds physical coordination, self-confidence, and respect for others — foundational skills they'll carry for life."
    ]}
    highlights={[
      "Basic stances and strikes (Kihon)',",
      "Partner exercises and controlled sparring",
      "First Kata patterns (Heian Shodan, Nidan)",
      "Anti-bullying strategies and personal safety",
      "Focus, listening skills, and classroom discipline",
      "Belt grading every 3–4 months",
    ]}
    schedule={[
      { label: 'Monday / Wednesday / Friday', time: '5:00 – 6:00 PM' },
      { label: 'Saturday',                    time: '9:00 – 10:30 AM' },
    ]}
  />
}

export function CourseTeens() {
  return <CoursePage
    title="Teen Karate"
    tag="⚡ For Teenagers"
    color="#a78bfa"
    icon="⚡"
    age="13 – 17 years"
    description={[
      "Designed for the high-energy teenager, this program channels adolescent drive into disciplined martial arts training.",
      "Students build real physical strength, mental resilience, and self-defense ability — all while developing leadership qualities."
    ]}
    highlights={[
      "Intermediate Kata and Bunkai application",
      "Kumite sparring with safety gear",
      "Strength, agility, and flexibility conditioning",
      "Tournament preparation and competition training",
      "Mental focus and stress management techniques",
      "Belt grading every 3–4 months",
    ]}
    schedule={[
      { label: 'Monday – Friday',    time: '6:00 – 7:30 PM' },
      { label: 'Saturday (optional)', time: '10:00 AM – 12:00 PM' },
    ]}
  />
}

export function CourseAdults() {
  return <CoursePage
    title="Adult Karate"
    tag="🔥 For Adults"
    color="#f87171"
    icon="🔥"
    age="18+ years"
    description={[
      "Our adult program delivers a complete martial arts experience — whether your goal is fitness, self-defense, stress relief, or achieving a black belt.",
      "Train alongside motivated peers under expert guidance, progressing at your own pace while being challenged to grow."
    ]}
    highlights={[
      "Complete Shotokan curriculum (Kihon, Kata, Kumite)",
      "Practical self-defense techniques",
      "Full-contact controlled sparring",
      "Advanced Kata (Bassai Dai, Kanku Dai, etc.)",
      "Black Belt pathway program",
      "Fitness: core strength, cardio, flexibility",
    ]}
    schedule={[
      { label: 'Monday – Saturday (Morning)', time: '5:00 – 7:00 AM' },
      { label: 'Monday – Saturday (Evening)', time: '6:30 – 8:00 PM' },
    ]}
  />
}
