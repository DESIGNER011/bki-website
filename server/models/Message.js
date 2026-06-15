// ============================================================
//  server/models/Message.js
// ============================================================
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  email:   { type: String, required: true, trim: true },
  phone:   { type: String, trim: true, default: '' },
  message: { type: String, required: true },
  date:    { type: Date, default: Date.now },
  read:    { type: Boolean, default: false },
});

module.exports = mongoose.model('Message', messageSchema);
