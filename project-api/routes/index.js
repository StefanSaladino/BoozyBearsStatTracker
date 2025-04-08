// routes/index.js
const express = require('express');
const router = express.Router();
const {
  loginLimiter,
  bruteForce,
  requireAdmin,
  authenticate,
  logout
} = require('../middleware/authMiddleware');

// Hardcoded admin credentials
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'password123'
};

// POST /login
router.post('/login', loginLimiter, bruteForce, (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    req.session.user = { username, isAdmin: true };
    return res.status(200).json({ message: 'Login successful', admin: true });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
});

// POST /logout
router.post('/logout', logout); // ✅ This should be a function

// GET /admin-dashboard
router.get('/admin-dashboard', authenticate, requireAdmin, (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Admin Dashboard',
    adminUser: req.session.user
  });
});

module.exports = router;
