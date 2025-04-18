// Base player model for Skater or Goalie using MongoDB discriminators
const mongoose = require('mongoose');
const options = { discriminatorKey: 'position', collection: 'players' };

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, enum: ['Skater', 'Goalie'], required: true }
}, options);

module.exports = mongoose.model('Player', playerSchema);
