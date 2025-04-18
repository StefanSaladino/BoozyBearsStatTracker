const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }
});

// Adds salt, hash, authenticate(), etc.
AdminSchema.plugin(plm, { usernameField: 'email' });

module.exports = mongoose.model('Admin', AdminSchema);
