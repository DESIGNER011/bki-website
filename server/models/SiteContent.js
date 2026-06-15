// ============================================================
//  server/models/SiteContent.js  —  courses, belts, achievements, schedules
// ============================================================
const mongoose = require('mongoose');

const siteContentSchema = new mongoose.Schema({
  key:       { type: String, required: true, unique: true },
  data:      { type: mongoose.Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SiteContent', siteContentSchema);
