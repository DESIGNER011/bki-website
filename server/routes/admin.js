// ============================================================
//  server/routes/admin.js  —  All protected admin routes
// ============================================================
const router  = require('express').Router();
const jwt     = require('jsonwebtoken');
const auth    = require('../middleware/auth');
const upload  = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');
const Message    = require('../models/Message');
const Trial      = require('../models/Trial');
const SiteContent = require('../models/SiteContent');
const Media      = require('../models/Media');

/* ── Auth ──────────────────────────────────────────────────── */
router.post('/login', async (req, res) => {
  const { password } = req.body;
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ success: true, token });
});

/* ── Messages ──────────────────────────────────────────────── */
router.get('/messages', auth, async (req, res) => {
  try {
    const messages = await Message.find().sort({ date: -1 });
    res.json(messages);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/messages/:id', auth, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ── Trials ────────────────────────────────────────────────── */
router.get('/trials', auth, async (req, res) => {
  try {
    const trials = await Trial.find().sort({ bookedAt: -1 });
    res.json(trials);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/trials/:id', auth, async (req, res) => {
  try {
    await Trial.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ── Site Content Update ───────────────────────────────────── */
router.post('/update', auth, async (req, res) => {
  try {
    const updates = req.body;
    for (const key of ['courses', 'belts', 'achievements', 'schedules']) {
      if (updates[key] !== undefined) {
        await SiteContent.findOneAndUpdate(
          { key },
          { key, data: updates[key], updatedAt: new Date() },
          { upsert: true, new: true }
        );
      }
    }
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ── Media — Upload ────────────────────────────────────────── */
router.post('/media/upload', auth, upload.array('files', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }
    const label    = req.body.label || '';
    const uploaded = [];

    for (const file of req.files) {
      const isVideo = file.mimetype.startsWith('video/');
      const media = await Media.create({
        filename:     file.filename || file.public_id,
        originalName: file.originalname,
        mimetype:     file.mimetype,
        type:         isVideo ? 'video' : 'image',
        url:          file.path,           // Cloudinary secure URL
        publicId:     file.filename || file.public_id,
        size:         file.size || 0,
        label,
      });
      uploaded.push(media);
    }

    res.status(201).json({ success: true, uploaded });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ── Media — List ──────────────────────────────────────────── */
router.get('/media', auth, async (req, res) => {
  try {
    const { type, label } = req.query;
    const filter = {};
    if (type && type !== 'all') filter.type = type;
    if (label) filter.label = label;
    const media = await Media.find(filter).sort({ uploadedAt: -1 });
    res.json(media);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ── Media — Edit Label ────────────────────────────────────── */
router.patch('/media/:id', auth, async (req, res) => {
  try {
    const media = await Media.findByIdAndUpdate(
      req.params.id,
      { label: req.body.label },
      { new: true }
    );
    if (!media) return res.status(404).json({ error: 'Media not found' });
    res.json(media);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ── Media — Delete ────────────────────────────────────────── */
router.delete('/media/:id', auth, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ error: 'Media not found' });

    // Remove from Cloudinary
    await cloudinary.uploader.destroy(media.publicId, {
      resource_type: media.type === 'video' ? 'video' : 'image',
    });

    await Media.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
