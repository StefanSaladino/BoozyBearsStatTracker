const express = require('express');
const passport = require('passport');
const Admin = require('../models/admin'); // Mongoose model using passport-local-mongoose
const {
  loginLimiter,
  bruteForce,
  requireAdmin,
  authenticate,
  logout
} = require('../middleware/authMiddleware');

const router = express.Router();

// POST /register — optional, use only once or protect it
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
    const admin = new Admin({ email });
    await Admin.register(admin, password);
    res.status(201).json({ message: 'Admin registered' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

// POST /login
router.post('/login', loginLimiter, bruteForce, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    req.login(user, err => {
      if (err) return next(err);
      return res.status(200).json({
        message: 'Login successful',
        adminUser: { email: user.email }
      });
    });
  })(req, res, next);
});

// POST /logout
router.post('/logout', logout);

// GET /admin-dashboard (protected route)
router.get('/admin-dashboard', authenticate, requireAdmin, (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Admin Dashboard',
    adminUser: req.user
  });
});

module.exports = router;
