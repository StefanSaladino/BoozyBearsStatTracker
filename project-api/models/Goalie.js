// Goalie-specific schema with different stats and highlight videos
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

const Goalie = Player.discriminator('Goalie', new mongoose.Schema({
  gamesPlayed: Number,
  goalsAgainstAverage: Number,
  wins: Number,
  losses: Number,
  ties: Number,
  overtimeLosses: Number,
  shutouts: Number,
  highlightVideos: [highlightSchema]
}));

module.exports = Goalie;
