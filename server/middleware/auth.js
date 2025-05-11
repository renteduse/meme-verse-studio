
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication invalid' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user to request object
    req.user = { userId: payload.userId, username: payload.username };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Authentication invalid' });
  }
};

module.exports = authMiddleware;
