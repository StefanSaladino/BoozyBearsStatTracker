const express = require("express");
const mongoose = require("mongoose");
const { getGFS } = require("../middleware/gridFS");
const Player = require("../models/Player");
const Skater = require("../models/Skater");
const Goalie = require("../models/Goalie");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

module.exports = (upload) => {
  // ✅ Get all highlight videos
  router.get("/", async (req, res) => {
    try {
      const players = await Player.find({}).lean();
      const allHighlights = [];

      players.forEach((player) => {
        if (player.highlightVideos && Array.isArray(player.highlightVideos)) {
          player.highlightVideos.forEach((video) => {
            allHighlights.push({
              playerId: player._id,
              playerName: player.name,
              filename: video.filename,
              highlightId: video._id,
              gameDate: video.gameDate,
              description: video.description,
            });
          });
        }
      });

      res.setHeader("Content-Type", "application/json");
      res.json(allHighlights);
    } catch (err) {
      console.error("Failed to fetch highlights", err);
      res.status(500).json({ message: "Server error fetching highlights" });
    }
  });

  // ✅ Stream video by filename
  router.get("/:filename", async (req, res) => {
    try {
      const gfs = getGFS();
      const file = await gfs.find({ filename: req.params.filename }).toArray();

      if (!file || file.length === 0) {
        return res.status(404).json({ error: "File not found" });
      }

      if (!file[0].contentType.startsWith("video/")) {
        return res.status(400).json({ error: "Not a video file" });
      }

      res.set("Content-Type", file[0].contentType);
      res.set("Cross-Origin-Resource-Policy", "cross-origin");

      const readStream = gfs.openDownloadStreamByName(req.params.filename);
      readStream.pipe(res);
    } catch (err) {
      console.error("❌ Stream error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

// ✅ Update a specific highlight (edit description or game date)
router.put("/:playerId/highlight/:highlightId", async (req, res) => {
    console.log("Received PUT request to update highlight");
    try {
      const { playerId, highlightId } = req.params;
      const { description, gameDate } = req.body;
  
      const player = await Player.findByIdAndUpdate(playerId);
      if (!player) return res.status(404).json({ message: "Player not found" });
  
      const highlight = player.highlightVideos.id(highlightId);
      if (!highlight) return res.status(404).json({ message: "Highlight not found" });
  
      highlight.description = description;
      highlight.gameDate = new Date(gameDate);
  
      await player.save();
      console.log("Highlight updated successfully"); // Add a log here
      res.json({ message: "Highlight updated successfully" });
    } catch (err) {
      console.error("Failed to update highlight", err);
      res.status(500).json({ error: err.message });
    }
  });
  
  

 // ✅ Delete a specific highlight
router.delete("/:playerId/highlight/:highlightId", authenticate, async (req, res) => {
    try {
      const { playerId, highlightId } = req.params;
  
      const player = await Player.findById(playerId); 
      if (!player) {
        return res.status(404).json({ error: "Player not found" });
      }
  
      const highlight = player.highlightVideos.id(highlightId);
      if (!highlight) {
        return res.status(404).json({ error: "Highlight not found" });
      }
  
      const filename = highlight.filename;
  
      // Remove highlight from player highlightVideos array
      highlight.deleteOne(); // Cleaner way to remove subdoc
      await player.save();   // Save updated player
  
      // Connect to GridFS bucket
      const conn = mongoose.connection;
      const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "videos" //Files are under videos.files/videos.chunks
      });
  
      // Find the video file by filename
      const file = await conn.db.collection("videos.files").findOne({ filename });
      if (file) {
        await bucket.delete(file._id);
      }
  
      res.status(200).json({ message: "Highlight and associated video deleted successfully" });
    } catch (error) {
      console.error("Failed to delete highlight", error);
      res.status(500).json({ error: "Failed to delete highlight" });
    }
  });

  return router;
};
