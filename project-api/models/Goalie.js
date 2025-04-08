// Goalie-specific schema with different stats and highlight videos
const Player = require('./Player');
const mongoose = require('mongoose');

const highlightSchema = new mongoose.Schema({
  filename: String,
  uploadedAt: { type: Date, default: Date.now },
  description: String,
  gameDate: Date
});

const Goalie = Player.discriminator('Goalie', new mongoose.Schema({
  gamesPlayed: Number,
  goalsAgainstAverage: Number,
  wins: Number,
  losses: Number,
  ties: Number,
  overtimeLosses: Number,
  highlightVideos: [highlightSchema]
}));

module.exports = Goalie;
