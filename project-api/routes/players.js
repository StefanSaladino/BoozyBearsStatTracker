// routes/players.js

const express = require("express");
const router = express.Router();
const Player = require("../models/Player");
const Skater = require("../models/Skater");
const Goalie = require("../models/Goalie");
// const authMiddleware = require('../middleware/auth');
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");

module.exports = (upload) => {
  const conn = mongoose.connection;
  let gfs;
  conn.once("open", () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("highlights");
  });

  // Create a player (skater or goalie)
  router.post("/", async (req, res) => {
    const { position } = req.body;
    // Choose model based on position
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

  // Get one player by ID
  router.get("/:id", async (req, res) => {
    try {
      const player = await Player.findById(req.params.id);
      if (!player) return res.status(404).json({ message: "Player not found" });
      res.json(player);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // PUT /players/:id — update an existing player
  router.put("/:id", async (req, res) => {
    try {
      // 1. Find the base document to get its position
      const base = await Player.findById(req.params.id);
      if (!base) return res.status(404).json({ message: "Player not found" });

      // 2. Choose the right model
      const Model =
        base.position === "Skater" ? Skater : require("../models/Goalie");

      // 3. Load the document through the discriminator
      const doc = await Model.findById(req.params.id);
      if (!doc) return res.status(404).json({ message: "Player not found" });

      // 4. Apply only the fields you allow to be edited
      Object.assign(doc, req.body);

      // 5. Calling .save() fires your pre('save') hook, so points updates
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
  router.post("/:id/highlight", upload.single("video"), async (req, res) => {
    try {
      const player = await Player.findById(req.params.id);
      if (!player) return res.status(404).json({ message: "Player not found" });

      const metadata = {
        filename: req.file.filename,
        gameDate: req.body.gameDate,
      };

      player.highlightVideos.push(metadata);
      await player.save();
      res.json(player);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete a highlight video
  router.delete("/:id/highlight/:filename", async (req, res) => {
    const { id, filename } = req.params;

    try {
      const player = await Player.findById(id);
      if (!player) return res.status(404).json({ message: "Player not found" });

      gfs.remove({ filename, root: "highlights" }, async (err) => {
        if (err) return res.status(500).json({ error: err.message });

        player.highlightVideos = player.highlightVideos.filter(
          (v) => v.filename !== filename
        );
        await player.save();

        res.json({ message: "Highlight deleted" });
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
