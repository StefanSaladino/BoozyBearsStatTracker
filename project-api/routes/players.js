// routes/players.js

const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
// const authMiddleware = require('../middleware/auth');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

module.exports = (upload) => {
  const conn = mongoose.connection;
  let gfs;
  conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('highlights');
  });

  // Create a player (skater or goalie)
  router.post('/', async (req, res) => {
    try {
      const newPlayer = new Player(req.body);
      const saved = await newPlayer.save();
      res.status(201).json(saved);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get all players
  router.get('/', async (req, res) => {
    try {
      const players = await Player.find();
      res.json(players);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get one player by ID
  router.get('/:id', async (req, res) => {
    try {
      const player = await Player.findById(req.params.id);
      if (!player) return res.status(404).json({ message: 'Player not found' });
      res.json(player);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update player
  router.put('/:id', async (req, res) => {
    try {
      const updated = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete player
  router.delete('/:id', async (req, res) => {
    try {
      const player = await Player.findByIdAndDelete(req.params.id);
      if (!player) return res.status(404).json({ message: 'Player not found' });
      res.json({ message: 'Player deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Upload highlight
  router.post('/:id/highlight', upload.single('video'), async (req, res) => {
    try {
      const player = await Player.findById(req.params.id);
      if (!player) return res.status(404).json({ message: 'Player not found' });

      const metadata = {
        filename: req.file.filename,
        gameDate: req.body.gameDate
      };

      player.highlightVideos.push(metadata);
      await player.save();
      res.json(player);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete a highlight video
  router.delete('/:id/highlight/:filename', async (req, res) => {
    const { id, filename } = req.params;

    try {
      const player = await Player.findById(id);
      if (!player) return res.status(404).json({ message: 'Player not found' });

      gfs.remove({ filename, root: 'highlights' }, async (err) => {
        if (err) return res.status(500).json({ error: err.message });

        player.highlightVideos = player.highlightVideos.filter(v => v.filename !== filename);
        await player.save();

        res.json({ message: 'Highlight deleted' });
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
