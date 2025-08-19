// middleware/verifyToken.js
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'asknex_secret';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('🛡️ Verifying token...');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('🔐 No token or bad format in header:', authHeader);
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    console.log('✅ Token verified. User:', decoded);
    next();
  } catch (err) {
    console.error('❌ Invalid token:', err.message);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = verifyToken;
