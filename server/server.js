// ============================================================
//  server/server.js  —  Express app entry point
// ============================================================
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
require('dotenv').config();

const app = express();



/* ── Middleware ─────────────────────────────────────────────── */
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* ── Routes ─────────────────────────────────────────────────── */
app.use('/api',           require('./routes/public'));
app.use('/api/contact',   require('./routes/contact'));
app.use('/api/trial',     require('./routes/trial'));
app.use('/api/gallery',   require('./routes/gallery'));
app.use('/api/admin',     require('./routes/admin'));

/* ── Health check ───────────────────────────────────────────── */
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

/* ── Connect to MongoDB Atlas and start ─────────────────────── */
const PORT = process.env.PORT || 5000;

// Disable mongoose buffering so queries fail fast when connection is down
mongoose.set('bufferCommands', false);

// Start server immediately so it is always responsive
app.listen(PORT, () => {
  console.log('\n  ╔══════════════════════════════════════════════════╗');
  console.log('  ║   BKI Backend Server — Ready                     ║');
  console.log('  ╠══════════════════════════════════════════════════╣');
  console.log(`  ║   🚀 API running at http://localhost:${PORT}        ║`);
  console.log('  ╚══════════════════════════════════════════════════╝\n');
});

// Connect to database in the background
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 4000 // Fast fail if connection cannot be made
  })
  .then(() => {
    console.log('  ✅ Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.warn('  ⚠️ MongoDB connection warning (running with fallback data):', err.message);
  });

