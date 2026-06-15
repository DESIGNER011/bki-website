import { useState } from 'react'
import { addMessage } from '../services/dbService'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState('')
  const [success, setSuccess] = useState(false)
  const [busy, setBusy] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true); setStatus('')
    try {
      await addMessage(form)
      setSuccess(true)
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      setStatus(err.message || 'Submission failed. Please try again.')
    } finally { setBusy(false) }
  }

  return (
    <div className="page-container contact-page" style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box' }}>
      <div style={{ width: '100%', position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <p className="eyebrow" style={{ letterSpacing: '0.15em', fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Get in Touch</p>
          <h1 className="section-title" style={{ margin: '0 0 0.5rem 0' }}>Contact <span className="text-gold">Us</span></h1>
          <p className="section-sub" style={{ maxWidth: 600, margin: '0 auto', fontSize: '0.92rem' }}></p>
        </div>

        <div className="contact-grid">
          {/* Info Cards Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', justifyContent: 'space-between' }}>
            {[
              { icon: '📍', title: 'Academy Location', text: 'Pollachi, Tamil Nadu' },
              { icon: '📞', title: 'Phone Number', text: '+91 93448 57541', href: 'tel:+91 93448 57541' },
              { icon: '✉️', title: 'Email Support', text: 'info@bestkarateofindia.com', href: 'mailto:info@bestkarateofindia.com' },
            ].map(({ icon, title, text, href }) => (
              <div key={title} className="card contact-info-card" style={{ flex: 1 }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = ''}>
                <div className="card-glow-overlay" />
                <div style={{ fontSize: '1.6rem', background: 'rgba(245,158,11,0.08)', width: 48, height: 48, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(245,158,11,0.15)' }}>{icon}</div>
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff', margin: '0 0 0.2rem 0' }}>{title}</p>
                  {href ? <a href={href} style={{ color: 'var(--gold)', textDecoration: 'none', fontSize: '0.85rem' }}>{text}</a>
                    : <p style={{ color: 'var(--text-2)', fontSize: '0.85rem', margin: 0 }}>{text}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Form Column */}
          <div className="card form-glass-card">
            <div className="card-glow-overlay" />
            {success ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 1rem', position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✅</div>
                <h3 style={{ color: '#22c55e', marginBottom: '0.5rem', fontSize: '1.2rem' }}>Message Sent!</h3>
                <p style={{ color: 'var(--text-2)', fontSize: '0.85rem' }}>We'll get back to you within 24 hours.</p>
                <button className="btn btn-outline" style={{ marginTop: '1rem', alignSelf: 'center' }} onClick={() => setSuccess(false)}>Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="form-group" style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Send Us a <span className="text-gold">Message</span></h2>
                <div className="form-field">
                  <label>Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
                </div>
                <div className="contact-form-row">
                  <div className="form-field">
                    <label>Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@example.com" required />
                  </div>
                  <div className="form-field">
                    <label>Phone</label>
                    <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="9876543210" />
                  </div>
                </div>
                <div className="form-field">
                  <label>Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} placeholder="Your message..." required rows={3} style={{ resize: 'vertical' }} />
                </div>
                {status && <p style={{ color: '#ef4444', margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}>{status}</p>}
                <button type="submit" className="btn btn-gold" style={{ width: '100%', fontWeight: 700, padding: '0.75rem' }} disabled={busy}>
                  {busy ? 'Sending...' : 'Send Message ✦'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
