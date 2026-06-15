import { useState, useRef, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'

const RESPONSES = {
  trial:    "Osu! We offer free trial classes. Book your slot on our <a href='#/trial' style='color:var(--gold);font-weight:700;'>Free Trial page</a>!",
  timings:  "Osu! Our schedules:<br/>• <b>Kids</b>: Mon, Wed, Fri (5–6 PM)<br/>• <b>Teens</b>: Mon–Fri (6–7:30 PM)<br/>• <b>Adults</b>: Mon–Sat (6:30–8 PM)<br/>See <a href='#/courses' style='color:var(--gold);'>Courses</a> for details.",
  location: "Osu! Our dojo is in <b>Pollachi, Tamil Nadu</b>. Branches in Coimbatore, Pondicherry, and Palakkad. See <a href='#/contact' style='color:var(--gold);'>Contact</a>.",
  belts:    "Osu! We teach Shotokan from White Belt (10th Kyu) to Black Belt (1st Dan+). See the <a href='#/belts' style='color:var(--gold);'>Belt System page</a>.",
  price:    "Osu! For specific fee details, contact us via <a href='#/contact' style='color:var(--gold);'>Contact page</a>.",
  hello:    "Osu! Hello! I'm your BKI Assistant. Ask me about schedules, location, belt ranks, or free trials!",
  default:  "Osu! I'm not sure about that. Ask me about class timings, location, belt ranks, or free trials. You can also <a href='#/contact' style='color:var(--gold);'>contact us directly</a>.",
}

function getBotResponse(query) {
  const q = query.toLowerCase()
  if (q.match(/trial|book|free|join/))          return RESPONSES.trial
  if (q.match(/time|timing|schedule|when|hour/)) return RESPONSES.timings
  if (q.match(/location|where|place|address/))   return RESPONSES.location
  if (q.match(/belt|rank|color|exam/))           return RESPONSES.belts
  if (q.match(/price|fee|cost|pay/))             return RESPONSES.price
  if (q.match(/hello|hi|hey|osu/))               return RESPONSES.hello
  return RESPONSES.default
}

export default function Chatbot() {
  const location = useLocation()
  const isHome   = location.pathname === '/'

  const [open,     setOpen]     = useState(false)
  const [messages, setMessages] = useState([
    { id: 0, text: 'Osu! Welcome to Best Karate of India. I am your Dojo Assistant. How can I help?', bot: true, time: 'Just now' }
  ])
  const [input,    setInput]    = useState('')
  const [typing,   setTyping]   = useState(false)
  const [pos,      setPos]      = useState({ right: 24, bottom: 24 })
  const messagesRef = useRef(null)
  const toggleRef   = useRef(null)

  /* ── Position over Gemini watermark on homepage ── */
  useEffect(() => {
    function update() {
      if (!isHome || window.innerWidth <= 768) {
        setPos({ right: 24, bottom: 24 })
        return
      }
      const vw = window.innerWidth, vh = window.innerHeight
      const aspect = 16 / 9
      let drawW, drawH
      if (vw / vh > aspect) { drawW = vw; drawH = Math.round(vw / aspect) }
      else                   { drawH = vh; drawW = Math.round(vh * aspect) }

      const wRightSrc  = 120, wBottomSrc = 120
      const scaleX = drawW / 1920, scaleY = drawH / 1020
      const ofX = Math.max(0, (drawW - vw) / 2)
      const ofY = Math.max(0, (drawH - vh) / 2)

      setPos({
        right:  Math.max(8, Math.round(wRightSrc  * scaleX - ofX - 36)),
        bottom: Math.max(8, Math.round(wBottomSrc * scaleY - ofY - 36)),
      })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [isHome])

  /* ── Auto-scroll messages ── */
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages, typing])

  /* ── Scroll isolation ── */
  const handleWheel = (e) => {
    const el = messagesRef.current
    if (!el) return
    const atTop    = el.scrollTop === 0 && e.deltaY < 0
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1 && e.deltaY > 0
    if (!atTop && !atBottom) e.stopPropagation()
    else e.preventDefault()
  }

  const addMessage = (text, bot) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setMessages(prev => [...prev, { id: Date.now(), text, bot, time }])
  }

  const handleSend = () => {
    const q = input.trim()
    if (!q) return
    addMessage(q, false)
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      addMessage(getBotResponse(q), true)
    }, 900)
  }

  const handleChip = (queryKey, label) => {
    addMessage(label, false)
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      addMessage(RESPONSES[queryKey] || RESPONSES.default, true)
    }, 850)
  }

  return (
    <>
      {/* Toggle Button */}
      {!open && (
        <button
          ref={toggleRef}
          className="chatbot-toggle"
          style={{ right: pos.right, bottom: pos.bottom }}
          onClick={() => setOpen(true)}
          aria-label="Open BKI Assistant"
        >
          <svg className="chatbot-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="var(--gold)" fill="rgba(11,15,25,0.45)" />
            <path d="M12 7.5L13.1 10.9L16.5 12L13.1 13.1L12 16.5L10.9 13.1L7.5 12L10.9 10.9L12 7.5Z" fill="var(--gold)" stroke="var(--gold)" strokeWidth="0.5" />
          </svg>
        </button>
      )}

      {/* Chat Panel */}
      <div className={`chatbot-panel${open ? ' open' : ''}`} onWheel={handleWheel}>
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-brand">
            <div className="chatbot-logo-circle">🥋</div>
            <div>
              <h3>BKI Assistant</h3>
              <p>Dojo Advisor • Online</p>
            </div>
          </div>
          <button className="chatbot-close-btn" onClick={() => setOpen(false)} aria-label="Close Chat">×</button>
        </div>

        {/* Messages */}
        <div className="chatbot-messages" ref={messagesRef}>
          {messages.map(msg => (
            <div key={msg.id} className={`chat-message ${msg.bot ? 'bot' : 'user'}`}>
              <div className="message-content" dangerouslySetInnerHTML={{ __html: msg.text }} />
              <span className="message-time">{msg.time}</span>
            </div>
          ))}
          {typing && (
            <div className="chatbot-typing visible">
              <div className="typing-bubble"><span/><span/><span/></div>
            </div>
          )}
        </div>

        {/* Quick Replies */}
        <div className="chatbot-quick-replies">
          <button className="quick-chip" onClick={() => handleChip('timings',  'Class timings?')}>Class timings?</button>
          <button className="quick-chip" onClick={() => handleChip('location', 'Dojo location?')}>Dojo location?</button>
          <button className="quick-chip" onClick={() => handleChip('trial',    'Book a free trial?')}>Book a free trial?</button>
          <button className="quick-chip" onClick={() => handleChip('belts',    'Belt ranks?')}>Belt ranks?</button>
        </div>

        {/* Input */}
        <div className="chatbot-input-area">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask BKI Assistant..."
            autoComplete="off"
          />
          <button onClick={handleSend} aria-label="Send">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}
