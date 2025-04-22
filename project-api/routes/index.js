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

// REGISTER admin
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const admin = new Admin({ email });
    await Admin.register(admin, password); // 🔐 auto-hashes password

    req.login(admin, (err) => {
      if (err) return res.status(500).json({ error: 'Login after registration failed' });
      return res.status(201).json({ message: 'Admin registered & logged in' });
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// LOGIN admin
router.post('/login', passport.authenticate('local'), (req, res) => {
  res.status(200).json({ message: 'Logged in successfully', user: req.user.email });
});

// LOGOUT admin
router.post('/logout', (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ error: 'Logout error' });
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

// SESSION CHECK
router.get('/admin-dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ user: req.user.email });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

module.exports = router;
