// ============================================================
//  server/models/Trial.js
// ============================================================
const mongoose = require('mongoose');

const trialSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, trim: true },
  phone:     { type: String, required: true, trim: true },
  age:       { type: String, default: '' },
  course:    { type: String, required: true },
  date:      { type: String, required: true },
  batch:     { type: String, default: '' },
  message:   { type: String, default: '' },
  bookedAt:  { type: Date, default: Date.now },
  status:    { type: String, default: 'pending', enum: ['pending', 'confirmed', 'cancelled'] },
});

module.exports = mongoose.model('Trial', trialSchema);
