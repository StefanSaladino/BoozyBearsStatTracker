const express = require("express");
const router = express.Router();
const Player = require("../models/Player");
const Skater = require("../models/Skater");
const Goalie = require("../models/Goalie");
const mongoose = require("mongoose");
const {
  authenticate
} = require('../middleware/authMiddleware');

module.exports = (upload) => {
  let gfs;
  const conn = mongoose.connection;
  conn.once("open", () => {
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: "highlights",
    });
  });

  // Create player
  router.post("/", authenticate, async (req, res) => {
    const { position } = req.body;
    const Model = position === "Skater" ? Skater : Goalie;
    const player = new Model(req.body);
    await player.save();
    res.status(201).json(player);
  });

  // Get all players
  router.get("/", async (req, res) => {
    try {
      const players = await Player.find();
      res.json(players);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get single player
  router.get("/:id", async (req, res) => {
    try {
      const player = await Player.findById(req.params.id);
      if (!player) return res.status(404).json({ message: "Player not found" });
      res.json(player);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update player
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

  // Delete player
  router.delete("/:id", async (req, res) => {
    try {
      const player = await Player.findByIdAndDelete(req.params.id);
      if (!player) return res.status(404).json({ message: "Player not found" });
      res.json({ message: "Player deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

  // Upload highlight
  router.post("/:id/highlight", authenticate, upload.single("video"), async (req, res) => {
    try {
      const player = await Player.findById(req.params.id);
      if (!player) return res.status(404).json({ message: "Player not found" });

      if (!req.file) return res.status(400).json({ message: "No video uploaded" });

      const metadata = {
        filename: req.file.filename,
        gameDate: req.body.gameDate,
        description: req.body.description,
      };

      player.highlightVideos.push(metadata);
      await player.save();

      res.json(player);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
