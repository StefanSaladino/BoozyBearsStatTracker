import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api";
import { validatePlayerForm } from "../../utils/validateForm";
import  ToastNotification from "../../components/ToastComponent";

const NewPlayerPage: React.FC = () => {
  const [name, setName] = useState("");
  const [jerseyNumber, setJerseyNumber] = useState<number>(0);
  const [position, setPosition] = useState<"Skater" | "Goalie">("Skater");
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [goals, setGoals] = useState(0);
  const [assists, setAssists] = useState(0);
  const [wins, setWins] = useState(0);
  const [goalsAgainstAverage, setGoalsAgainstAverage] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      name,
      jerseyNumber,
      position,
      gamesPlayed,
      goals,
      assists,
      wins,
      goalsAgainstAverage,
    };

    const validationErrors = validatePlayerForm(formData, position);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload: any = {
      name,
      jerseyNumber,
      position,
      gamesPlayed,
    };

    if (position === "Skater") {
      payload.goals = goals;
      payload.assists = assists;
    } else {
      payload.wins = wins;
      payload.goalsAgainstAverage = goalsAgainstAverage;
    }

    try {
      await axios.post("/players", payload);
      setShowToast(true); // ✅ show success toast
      setTimeout(() => navigate("/admin-dashboard"), 2000);
    } catch (err) {
      console.error("Error creating player:", err);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="card shadow p-4">
        <div className="card-body">
          <h2 className="card-title mb-4">Add New Player</h2>
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            {/* Jersey Number */}
            <div className="mb-3">
              <label className="form-label">Jersey Number</label>
              <input
                type="number"
                className={`form-control ${errors.jerseyNumber ? "is-invalid" : ""}`}
                value={jerseyNumber}
                onChange={(e) => setJerseyNumber(Number(e.target.value))}
              />
              {errors.jerseyNumber && (
                <div className="invalid-feedback">{errors.jerseyNumber}</div>
              )}
            </div>

            {/* Position */}
            <div className="mb-3">
              <label className="form-label">Position</label>
              <select
                className="form-select"
                value={position}
                onChange={(e) => setPosition(e.target.value as "Skater" | "Goalie")}
              >
                <option value="Skater">Skater</option>
                <option value="Goalie">Goalie</option>
              </select>
            </div>

            {/* Games Played */}
            <div className="mb-3">
              <label className="form-label">Games Played</label>
              <input
                type="number"
                className={`form-control ${errors.gamesPlayed ? "is-invalid" : ""}`}
                value={gamesPlayed}
                onChange={(e) => setGamesPlayed(Number(e.target.value))}
              />
              {errors.gamesPlayed && (
                <div className="invalid-feedback">{errors.gamesPlayed}</div>
              )}
            </div>

            {/* Skater or Goalie Specific Fields */}
            {position === "Skater" ? (
              <>
                <div className="mb-3">
                  <label className="form-label">Goals</label>
                  <input
                    type="number"
                    className={`form-control ${errors.goals ? "is-invalid" : ""}`}
                    value={goals}
                    onChange={(e) => setGoals(Number(e.target.value))}
                  />
                  {errors.goals && (
                    <div className="invalid-feedback">{errors.goals}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Assists</label>
                  <input
                    type="number"
                    className={`form-control ${errors.assists ? "is-invalid" : ""}`}
                    value={assists}
                    onChange={(e) => setAssists(Number(e.target.value))}
                  />
                  {errors.assists && (
                    <div className="invalid-feedback">{errors.assists}</div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="mb-3">
                  <label className="form-label">Wins</label>
                  <input
                    type="number"
                    className={`form-control ${errors.wins ? "is-invalid" : ""}`}
                    value={wins}
                    onChange={(e) => setWins(Number(e.target.value))}
                  />
                  {errors.wins && (
                    <div className="invalid-feedback">{errors.wins}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Goals Against Average</label>
                  <input
                    type="number"
                    step="0.01"
                    className={`form-control ${
                      errors.goalsAgainstAverage ? "is-invalid" : ""
                    }`}
                    value={goalsAgainstAverage}
                    onChange={(e) => setGoalsAgainstAverage(Number(e.target.value))}
                  />
                  {errors.goalsAgainstAverage && (
                    <div className="invalid-feedback">{errors.goalsAgainstAverage}</div>
                  )}
                </div>
              </>
            )}

            {/* Buttons */}
            <div className="d-flex mt-4">
              <button type="submit" className="btn btn-success me-3">
                Create Player
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/admin-dashboard")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastNotification
        show={showToast}
        message="New player added successfully!"
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default NewPlayerPage;
