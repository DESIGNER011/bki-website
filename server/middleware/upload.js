// ============================================================
//  server/middleware/upload.js  —  Multer + Cloudinary storage
// ============================================================
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith('video/');
    return {
      folder:        isVideo ? 'bki/videos' : 'bki/images',
      resource_type: isVideo ? 'video' : 'image',
      // Cloudinary will auto-generate a public_id
    };
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
    'video/mp4', 'video/webm', 'video/quicktime',
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200 MB max
});

module.exports = upload;
