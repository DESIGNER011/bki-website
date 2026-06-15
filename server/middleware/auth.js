// ============================================================
//  server/middleware/auth.js  —  JWT verification
// ============================================================
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['x-admin-token'];
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
