const express = require('express');
const passport = require('passport');
const Admin = require('../models/admin');
const {
  loginLimiter,
  authenticate,
  logout
} = require('../middleware/authMiddleware');

const router = express.Router();

// REGISTER admin — Only if no admin exists
router.post('/register', async (req, res, next) => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      return res.status(403).json({ error: 'Admin registration is disabled. Please contact your server administrator for more information.' });
    }
    next();
  } catch (err) {
    console.error('Error checking admin count:', err);
    res.status(500).json({ error: 'Server error during registration check' });
  }
}, async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = new Admin({ email });
    await Admin.register(admin, password); // hashes password

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
router.post('/login', passport.authenticate('local'), (req, res, next) => {
  // Ensure session is saved before responding
  req.session.save((err) => {
    if (err) {
      console.error("❌ Error saving session:", err);
      return next(err);
    }
    console.log("✅ Session saved for user:", req.user.email);
    res.status(200).json({ message: 'Logged in successfully', user: req.user.email });
  });
});


// LOGOUT admin
router.post('/logout', logout);

// SESSION CHECK — Protected route
router.get('/admin-dashboard', authenticate, (req, res) => {
  res.status(200).json({ user: req.user.email });
});

module.exports = router;
