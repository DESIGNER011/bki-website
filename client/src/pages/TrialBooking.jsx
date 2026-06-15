import { useState } from 'react'
import { addTrial } from '../services/dbService'

export default function TrialBooking() {
  const [form,    setForm]    = useState({ name: '', email: '', phone: '', age: '', course: '', date: '', batch: '', message: '' })
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState('')
  const [busy,    setBusy]    = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true); setError('')
    try {
      await addTrial(form)
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Submission failed. Please try again.')
    } finally { setBusy(false) }
  }

  if (success) return (
    <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🥋</div>
        <h2 className="text-gold" style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Osu! You're Booked!</h2>
        <p style={{ color: 'var(--text-2)', marginBottom: '2rem' }}>We'll contact you within 24 hours to confirm your free trial class.</p>
        <button className="btn btn-outline" onClick={() => { setSuccess(false); setForm({ name:'',email:'',phone:'',age:'',course:'',date:'',batch:'',message:'' }) }}>Book Another Trial</button>
      </div>
    </div>
  )

  return (
    <div className="page-container trial-booking-page" style={{ paddingTop: '3rem' }}>
      <div className="trial-header slide-left">
        <span className="trial-tag">🥋 Free Trial Session</span>
        <h1 className="page-title" style={{ marginTop: '0.5rem' }}>Book Your <span className="text-gold">Free Trial Class</span></h1>
        <p className="trial-intro">Experience a full training session at our dojo — absolutely free, with zero commitment.</p>
      </div>

      <div className="trial-layout">
        <div className="trial-form-card slide-left">
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.3rem' }}>Fill in Your Details</h2>
          <form onSubmit={handleSubmit} className="trial-form" noValidate>
            <div className="form-field">
              <label>Full Name <span className="required">*</span></label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Arjun Sharma" required />
            </div>
            <div className="trial-grid-2">
              <div className="form-field">
                <label>Email <span className="required">*</span></label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@example.com" required />
              </div>
              <div className="form-field">
                <label>Phone <span className="required">*</span></label>
                <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="9876543210" required />
              </div>
            </div>
            <div className="trial-grid-2">
              <div className="form-field">
                <label>Age</label>
                <input name="age" type="number" value={form.age} onChange={handleChange} placeholder="Your age" min="4" max="99" />
              </div>
              <div className="form-field">
                <label>Program <span className="required">*</span></label>
                <select name="course" value={form.course} onChange={handleChange} required>
                  <option value="" disabled>Select a program</option>
                  <option value="Kids Karate (Ages 5–12)">Kids Karate (Ages 5–12)</option>
                  <option value="Teen Karate (Ages 13–17)">Teen Karate (Ages 13–17)</option>
                  <option value="Adult Karate (Ages 18+)">Adult Karate (Ages 18+)</option>
                </select>
              </div>
            </div>
            <div className="trial-grid-2">
              <div className="form-field">
                <label>Preferred Date <span className="required">*</span></label>
                <input name="date" type="date" value={form.date} onChange={handleChange} required min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="form-field">
                <label>Preferred Batch</label>
                <select name="batch" value={form.batch} onChange={handleChange}>
                  <option value="">No preference</option>
                  <option value="Morning (5:00 AM – 7:00 AM)">Morning (5:00 AM – 7:00 AM)</option>
                  <option value="Evening (5:00 PM – 9:00 PM)">Evening (5:00 PM – 9:00 PM)</option>
                </select>
              </div>
            </div>
            <div className="form-field">
              <label>Additional Notes</label>
              <textarea name="message" value={form.message} onChange={handleChange} placeholder="Any health conditions, experience, or questions?" rows={3} style={{ resize: 'vertical' }} />
            </div>
            {error && <p style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}
            <button type="submit" className="btn btn-gold" style={{ width: '100%', fontWeight: 700, fontSize: '1rem', padding: '0.9rem' }} disabled={busy}>
              {busy ? 'Booking...' : '🥋 Book My Free Trial'}
            </button>
          </form>
        </div>

        {/* Info Card */}
        <div className="trial-info-panel slide-right">
          <div className="trial-info-card">
            <h3 className="text-gold" style={{ marginBottom: '1.5rem' }}>What to Expect</h3>
            {[
              ['🥋', 'Warm-Up Session', 'Start with light cardio and stretching'],
              ['⚔️', 'Basics Training', 'Learn fundamental stances, blocks, and punches'],
              ['🏆', 'Kata Practice', 'Experience your first Kata form'],
              ['🤝', 'Meet the Sensei', 'Personal guidance from our instructors'],
            ].map(([icon, title, desc]) => (
              <div key={title} style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{icon}</span>
                <div>
                  <p style={{ fontWeight: 700, marginBottom: '0.2rem' }}>{title}</p>
                  <p style={{ color: 'var(--text-2)', fontSize: '0.85rem' }}>{desc}</p>
                </div>
              </div>
            ))}
            <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'rgba(245,158,11,0.06)', borderRadius: '8px', border: '1px solid rgba(245,158,11,0.35)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' }}>
              <p className="text-gold" style={{ fontWeight: 700, marginBottom: '0.5rem' }}>✦ Completely Free</p>
              <p style={{ color: 'var(--text-2)', fontSize: '0.85rem' }}>No credit card required. No obligation to join. Just come, train, and experience the difference.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
