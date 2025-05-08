// Skater-specific schema with goals, assists, games played, highlight videos, and calculated points
const Player = require('./Player');
const mongoose = require('mongoose');

// Highlight schema now supports both file uploads and YouTube URLs
const highlightSchema = new mongoose.Schema({
  filename: String,            // existing field for storing uploaded filenames
  youtubeUrl: String,          // new field for YouTube links
  description: String,
  gameDate: Date,
  uploadedAt: { type: Date, default: Date.now }
});

// Define Skater schema with stored `points`
const skaterSchema = new mongoose.Schema({
  goals: { type: Number, default: 0 },
  assists: { type: Number, default: 0 },
  gamesPlayed: { type: Number, default: 0 },
  points: { type: Number, default: 0 }, // ✅ Now stored directly
  highlightVideos: [highlightSchema]
});

// Automatically calculate and store points before saving
skaterSchema.pre('save', function (next) {
  this.points = (this.goals || 0) + (this.assists || 0);
  next();
});

// Use discriminator on base Player schema
const Skater = Player.discriminator('Skater', skaterSchema);

module.exports = Skater;
