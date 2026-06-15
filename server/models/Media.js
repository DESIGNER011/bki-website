// ============================================================
//  server/models/Media.js  —  Cloudinary-hosted images & videos
// ============================================================
const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  filename:     { type: String, required: true },
  originalName: { type: String, required: true },
  mimetype:     { type: String, required: true },
  type:         { type: String, required: true, enum: ['image', 'video'] },
  url:          { type: String, required: true },   // Cloudinary secure URL
  publicId:     { type: String, required: true },   // Cloudinary public_id (for deletion)
  size:         { type: Number, required: true },   // bytes
  label:        { type: String, default: '' },      // admin-assigned tag
  uploadedAt:   { type: Date, default: Date.now },
});

module.exports = mongoose.model('Media', mediaSchema);
