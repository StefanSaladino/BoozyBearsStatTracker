// middleware/authMiddleware.js
const rateLimit = require('express-rate-limit');

// Login rate limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { message: 'Too many login attempts. Try again later.' }
});

// Basic brute force simulation
const bruteForce = (req, res, next) => {
  // Add actual brute force logic if needed
  next();
};

// Require authentication
const authenticate = (req, res, next) => {
  if (req.session && req.session.user) return next();
  return res.status(401).json({ message: 'Unauthorized' });
};

// Require admin access
const requireAdmin = (req, res, next) => {
  if (req.session?.user?.isAdmin) return next();
  return res.status(403).json({ message: 'Forbidden: Admins only' });
};

// Logout handler
const logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logged out' });
  });
};

module.exports = {
  loginLimiter,
  bruteForce,
  authenticate,
  requireAdmin,
  logout
};
