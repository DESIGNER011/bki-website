// ============================================================
//  server/routes/contact.js  —  POST /api/contact
// ============================================================
const router = require('express').Router();
const Message = require('../models/Message');

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required.' });
    }
    const msg = await Message.create({ name, email, phone, message });
    res.status(201).json({ success: true, id: msg._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
