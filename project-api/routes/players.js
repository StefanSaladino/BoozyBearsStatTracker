// routes/players.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Player = require('../models/Player');
const Skater = require('../models/Skater');
const Goalie = require('../models/Goalie');
const { authenticate } = require('../middleware/authMiddleware');

// ──────────────────────────────────
// Create a new player (admin only)
// ──────────────────────────────────
router.post('/', authenticate, async (req, res) => {
  try {
    const { position, ...rest } = req.body;
    const Model = position === 'Skater' ? Skater : Goalie;
    const player = new Model(rest);
    await player.save();
    res.status(201).json(player);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ──────────────────────────────────
// Get all players
// ──────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const players = await Player.find().lean();
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ──────────────────────────────────
// Get single player by ID
// ──────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: "Player not found" });
    res.json(player);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ──────────────────────────────────
// Update player
// ──────────────────────────────────
router.put("/:id", async (req, res) => {
  try {
    const base = await Player.findById(req.params.id);
    if (!base) return res.status(404).json({ message: "Player not found" });

    const Model = base.position === "Skater" ? Skater : Goalie;
    const doc = await Model.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Player not found" });

    Object.assign(doc, req.body);
    const updated = await doc.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ──────────────────────────────────
// Delete player
// ──────────────────────────────────
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) return res.status(404).json({ message: 'Player not found' });
    res.json({ message: 'Player deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ──────────────────────────────────
// Add a YouTube‐based highlight to a player
// ──────────────────────────────────
router.post('/:id/highlight', authenticate, async (req, res) => {
  try {
    const { youtubeUrl, description, gameDate } = req.body;
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: 'Player not found' });

    // push into the array
    player.highlightVideos.push({ youtubeUrl, description, gameDate });
    await player.save();

    res.status(201).json({ message: 'Highlight added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
