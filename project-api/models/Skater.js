// Skater-specific schema with goals, assists, games played, and highlight videos
const Player = require('./Player');
const mongoose = require('mongoose');

const highlightSchema = new mongoose.Schema({
  filename: String,
  uploadedAt: { type: Date, default: Date.now },
  description: String,
  gameDate: Date
});

const Skater = Player.discriminator('Skater', new mongoose.Schema({
  goals: Number,
  assists: Number,
  gamesPlayed: Number,
  highlightVideos: [highlightSchema]
}));

Skater.schema.virtual('points').get(function () {
  return this.goals + this.assists;
});

module.exports = Skater;
