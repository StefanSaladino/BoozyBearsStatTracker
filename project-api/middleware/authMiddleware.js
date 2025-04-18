const rateLimit = require('express-rate-limit');

// Login rate limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { message: 'Too many login attempts. Try again later.' }
});

// Brute force stub (custom logic can go here)
const bruteForce = (req, res, next) => {
  next();
};

// Require login session
const authenticate = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ message: 'Unauthorized' });
};

// Require admin access (adjust logic as needed)
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.email === process.env.ADMIN_EMAIL) return next();
  return res.status(403).json({ message: 'Forbidden: Admins only' });
};

// Logout handler
const logout = (req, res) => {
  req.logout(err => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });
};

module.exports = {
  loginLimiter,
  bruteForce,
  authenticate,
  requireAdmin,
  logout
};
