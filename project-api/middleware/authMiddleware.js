const rateLimit = require('express-rate-limit');

// Login rate limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { message: 'Too many login attempts. Try again later.' }
});

// Require login session
const authenticate = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.redirect('/login');  // Redirect to the login page if not authenticated
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
  authenticate,
  logout
};
