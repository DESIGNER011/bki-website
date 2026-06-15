// ============================================================
//  server/routes/gallery.js  —  GET /api/gallery  (public)
// ============================================================
const router = require('express').Router();
const mongoose = require('mongoose');
const Media = require('../models/Media');
const { fallbackGallery } = require('../fallbackData');

router.get('/', async (req, res) => {
  try {
    const { type, label } = req.query;
    const filter = {};
    if (type && type !== 'all') filter.type = type;
    if (label)                  filter.label = label;

    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected');
    }

    const media = await Media.find(filter).sort({ uploadedAt: -1 }).maxTimeMS(2000);
    if (media && media.length > 0) {
      return res.json(media);
    }

    // Apply manual filtering to fallback data
    let filteredFallback = fallbackGallery;
    if (type && type !== 'all') filteredFallback = filteredFallback.filter(m => m.type === type);
    if (label)                  filteredFallback = filteredFallback.filter(m => m.label === label);
    res.json(filteredFallback);
  } catch (err) {
    console.warn('⚠️ MongoDB error fetching gallery, using fallback data:', err.message);
    const { type, label } = req.query;
    let filteredFallback = fallbackGallery;
    if (type && type !== 'all') filteredFallback = filteredFallback.filter(m => m.type === type);
    if (label)                  filteredFallback = filteredFallback.filter(m => m.label === label);
    res.json(filteredFallback);
  }
});

module.exports = router;

