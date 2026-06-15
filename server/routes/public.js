// ============================================================
//  server/routes/public.js  —  Public read-only data endpoints
// ============================================================
const router = require('express').Router();
const mongoose = require('mongoose');
const SiteContent = require('../models/SiteContent');
const { fallbackBelts, fallbackAchievements } = require('../fallbackData');

const getContent = async (key) => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('Database not connected');
  }
  // Set query timeout to prevent hanging
  const doc = await SiteContent.findOne({ key }).maxTimeMS(2000);
  return doc ? doc.data : [];
};

router.get('/courses', async (req, res) => {
  try {
    res.json(await getContent('courses'));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/belts', async (req, res) => {
  try {
    const data = await getContent('belts');
    if (data && data.length > 0) {
      return res.json(data);
    }
    return res.json(fallbackBelts);
  } catch (e) {
    console.warn('⚠️ MongoDB error fetching belts, using fallback data:', e.message);
    res.json(fallbackBelts);
  }
});

router.get('/achievements', async (req, res) => {
  try {
    const data = await getContent('achievements');
    if (data && data.length > 0) {
      return res.json(data);
    }
    return res.json(fallbackAchievements);
  } catch (e) {
    console.warn('⚠️ MongoDB error fetching achievements, using fallback data:', e.message);
    res.json(fallbackAchievements);
  }
});

router.get('/schedules', async (req, res) => {
  try {
    res.json(await getContent('schedules'));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;

