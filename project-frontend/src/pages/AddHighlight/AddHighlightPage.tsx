// src/pages/AddHighlight/AddHighlightPage.tsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api";
import { validateHighlightForm } from "../../utils/validateForm";
import ToastNotification from "../../components/ToastComponent";

interface PlayerOption {
  _id: string;
  name: string;
}

const AddHighlightPage: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const [players, setPlayers] = useState<PlayerOption[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState(playerId || "");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [description, setDescription] = useState("");
  const [gameDate, setGameDate] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  // load players list for dropdown
  useEffect(() => {
    axios
      .get<PlayerOption[]>("/players")
      .then((res) => setPlayers(res.data))
      .catch((err) => console.error("Failed to load players:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // validate against new signature
    const validationErrors = validateHighlightForm({
      selectedPlayer,
      youtubeUrl,
      description,
      gameDate,
    });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // POST /api/videos/:playerId expects { youtubeUrl, description, gameDate }
      await axios.post(`/api/videos/${selectedPlayer}`, {
        youtubeUrl,
        description,
        gameDate,
      });

      setShowToast(true);
      setTimeout(() => navigate("/admin-dashboard"), 2000);
    } catch (err) {
      console.error("Error adding highlight:", err);
    }
  };

  return (
    <div className="container mt-5 pb-4">
      <div className="card shadow p-4">
        <h2 className="mb-4">Add Highlight Video</h2>
        <form onSubmit={handleSubmit}>
          <div className="row gx-3">
            {/* Player selector */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Player</label>
              <select
                className={`form-select ${
                  errors.selectedPlayer ? "is-invalid" : ""
                }`}
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
              >
                <option value="">-- Select Player --</option>
                {players.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {errors.selectedPlayer && (
                <div className="invalid-feedback">
                  {errors.selectedPlayer}
                </div>
              )}
            </div>

            {/* YouTube URL */}
            <div className="col-md-6 mb-3">
              <label className="form-label">YouTube URL</label>
              <input
                type="url"
                className={`form-control ${errors.youtubeUrl ? "is-invalid" : ""}`}
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
              {errors.youtubeUrl && (
                <div className="invalid-feedback">{errors.youtubeUrl}</div>
              )}
            </div>

            {/* Description */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Description</label>
              <input
                type="text"
                className={`form-control ${
                  errors.description ? "is-invalid" : ""
                }`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {errors.description && (
                <div className="invalid-feedback">{errors.description}</div>
              )}
            </div>

            {/* Game date */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Game Date</label>
              <input
                type="date"
                className={`form-control ${errors.gameDate ? "is-invalid" : ""}`}
                value={gameDate}
                onChange={(e) => setGameDate(e.target.value)}
              />
              {errors.gameDate && (
                <div className="invalid-feedback">{errors.gameDate}</div>
              )}
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-3 me-2">
            Submit Highlight
          </button>
          <button
            type="button"
            className="btn btn-secondary mt-3"
            onClick={() => navigate("/admin-dashboard")}
          >
            Cancel
          </button>
        </form>
      </div>

      <ToastNotification
        show={showToast}
        message="Highlight added successfully!"
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default AddHighlightPage;
