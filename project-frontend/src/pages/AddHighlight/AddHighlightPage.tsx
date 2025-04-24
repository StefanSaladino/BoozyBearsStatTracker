import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api";
import { validateHighlightForm } from "../../utils/validateForm";

interface PlayerOption {
  _id: string;
  name: string;
}

const AddHighlightPage: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const [players, setPlayers] = useState<PlayerOption[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState(playerId || "");
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [gameDate, setGameDate] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<PlayerOption[]>("/players")
      .then((res) => setPlayers(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateHighlightForm({
      selectedPlayer,
      file,
      description,
      gameDate,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const form = new FormData();
    form.append("video", file!);
    form.append("description", description);
    form.append("gameDate", gameDate);

    try {
      await axios.post(`/players/${selectedPlayer}/highlight`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/admin-dashboard");
    } catch (err) {
      console.error("Error uploading highlight:", err);
    }
  };

  return (
    <div className="container mt-5 pb-4">
      <h2 className="mb-4">Add Highlight Video</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Player</label>
          <select
            className={`form-select ${errors.selectedPlayer ? "is-invalid" : ""}`}
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}>
            <option value="">-- Select Player --</option>
            {players.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
          {errors.selectedPlayer && (
            <div className="invalid-feedback">{errors.selectedPlayer}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Video File</label>
          <input
            className={`form-control ${errors.file ? "is-invalid" : ""}`}
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {errors.file && <div className="invalid-feedback">{errors.file}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <input
            className={`form-control ${errors.description ? "is-invalid" : ""}`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && (
            <div className="invalid-feedback">{errors.description}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Game Date</label>
          <input
            className={`form-control ${errors.gameDate ? "is-invalid" : ""}`}
            type="date"
            value={gameDate}
            onChange={(e) => setGameDate(e.target.value)}
          />
          {errors.gameDate && <div className="invalid-feedback">{errors.gameDate}</div>}
        </div>

        <button type="submit" className="btn btn-primary mt-2 me-2">
          Upload Highlight
        </button>
        <button
          type="button"
          className="btn btn-secondary mt-2"
          onClick={() => navigate("/admin-dashboard")}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddHighlightPage;
