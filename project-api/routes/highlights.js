const express = require("express");
const Player = require("../models/Player");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const players = await Player.find({}).lean();
    const allHighlights = [];

    players.forEach((player) => {
      if (Array.isArray(player.highlightVideos)) {
        player.highlightVideos.forEach((video) => {
          allHighlights.push({
            playerId: player._id,
            playerName: player.name,
            highlightId: video._id,
            youtubeUrl: video.youtubeUrl,
            gameDate: video.gameDate,
            description: video.description,
          });
        });
      }
    });

    res.json(allHighlights);
  } catch (err) {
    console.error("Failed to fetch highlights", err);
    res.status(500).json({ message: "Server error fetching highlights" });
  }
});

// Add new highlight (admin only)
router.post("/:playerId", authenticate, async (req, res) => {
  try {
    const { playerId } = req.params;
    const { youtubeUrl, description, gameDate } = req.body;

    const player = await Player.findById(playerId);
    if (!player) return res.status(404).json({ message: "Player not found" });

    player.highlightVideos.push({ youtubeUrl, description, gameDate });
    await player.save();

    res.status(201).json({ message: "Highlight added successfully" });
  } catch (err) {
    console.error("Failed to add highlight", err);
    res.status(500).json({ error: err.message });
  }
});

// Update highlight
router.put("/:playerId/highlight/:highlightId", authenticate, async (req, res) => {
  try {
    const { playerId, highlightId } = req.params;
    const { youtubeUrl, description, gameDate } = req.body;

    const player = await Player.findById(playerId);
    if (!player) return res.status(404).json({ message: "Player not found" });

    const highlight = player.highlightVideos.id(highlightId);
    if (!highlight) return res.status(404).json({ message: "Highlight not found" });

    if (youtubeUrl) highlight.youtubeUrl = youtubeUrl;
    if (description) highlight.description = description;
    if (gameDate) highlight.gameDate = new Date(gameDate);

    await player.save();
    res.json({ message: "Highlight updated successfully" });
  } catch (err) {
    console.error("Failed to update highlight", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete highlight
router.delete("/:playerId/highlight/:highlightId", authenticate, async (req, res) => {
  try {
    const { playerId, highlightId } = req.params;

    const player = await Player.findById(playerId);
    if (!player) return res.status(404).json({ message: "Player not found" });

    const highlight = player.highlightVideos.id(highlightId);
    if (!highlight) return res.status(404).json({ message: "Highlight not found" });

    highlight.remove();
    await player.save();

    res.json({ message: "Highlight deleted successfully" });
  } catch (err) {
    console.error("Failed to delete highlight", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
