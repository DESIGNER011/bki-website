// ============================================================
//  server/routes/trial.js  —  POST /api/trial
// ============================================================
const router = require('express').Router();
const Trial = require('../models/Trial');

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, age, course, date, batch, message } = req.body;
    if (!name || !email || !phone || !course || !date) {
      return res.status(400).json({ error: 'Required fields: name, email, phone, course, date.' });
    }
    const trial = await Trial.create({ name, email, phone, age, course, date, batch, message });
    res.status(201).json({ success: true, id: trial._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
