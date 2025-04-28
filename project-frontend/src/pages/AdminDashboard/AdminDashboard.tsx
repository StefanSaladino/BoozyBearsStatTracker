import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "../../api";
import { AuthContext } from "../../context/AuthContext";
import { validatePlayerForm } from "../../utils/validateForm";
import "../AdminDashboard/AdminDashboard.css";

interface Player {
  _id: string;
  name: string;
  position: "Skater" | "Goalie";
  gamesPlayed: number;
  goals?: number;
  assists?: number;
  points?: number;
  wins?: number;
  goalsAgainstAverage?: number;
  shutouts?: number;
}

const AdminDashboard: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [players, setPlayers] = useState<Player[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Player>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      axios
        .get<Player[]>("/players")
        .then((res) => setPlayers(res.data))
        .catch((err) => console.error("Error fetching players:", err));
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return <Navigate to="/login" />;

  const handleEdit = (player: Player) => {
    setEditingId(player._id);
    setFormData({ ...player });
    setErrors({});
  };

  const handleSave = async (id: string) => {
    const validationErrors = validatePlayerForm(formData, formData.position!);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axios.put(`/players/${id}`, formData);
      const res = await axios.get<Player[]>("/players");
      setPlayers(res.data);
      setEditingId(null);
      setFormData({});
      setErrors({});
    } catch (err) {
      console.error("Error saving player:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this player?")) return;
    try {
      await axios.delete(`/players/${id}`);
      setPlayers((ps) => ps.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting player:", err);
    }
  };

  const handleAddHighlight = (id: string) => {
    navigate(`/admin/add-highlight/${id}`);
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4 text-center">Admin Dashboard</h1>

      {/* Table for large screens */}
      <div className="d-none d-sm-block">
        <div className="table-responsive">
          <table className="table table-bordered table-striped table-hover align-middle text-center">
            <thead className="thead-dark">
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>GP</th>
                <th>Stats</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => {
                const isEditing = editingId === player._id;
                return (
                  <tr key={player._id}>
                    <td className="text-break">
                      {isEditing ? (
                        <>
                          <input
                            className={`form-control ${
                              errors.name ? "is-invalid" : ""
                            }`}
                            value={formData.name ?? ""}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                          />
                          {errors.name && (
                            <div className="invalid-feedback">
                              {errors.name}
                            </div>
                          )}
                        </>
                      ) : (
                        player.name
                      )}
                    </td>

                    <td>{player.position}</td>

                    <td>
                      {isEditing ? (
                        <>
                          <input
                            type="number"
                            className={`form-control ${
                              errors.gamesPlayed ? "is-invalid" : ""
                            }`}
                            value={formData.gamesPlayed ?? ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                gamesPlayed:
                                  e.target.value === ""
                                    ? undefined
                                    : +e.target.value,
                              })
                            }
                          />
                          {errors.gamesPlayed && (
                            <div className="invalid-feedback">
                              {errors.gamesPlayed}
                            </div>
                          )}
                        </>
                      ) : (
                        player.gamesPlayed
                      )}
                    </td>

                    <td className="text-break">
                      {player.position === "Skater" ? (
                        isEditing ? (
                          <>
                            <div className="mb-2">
                              <label className="form-label">G</label>
                              <input
                                type="number"
                                className={`form-control ${
                                  errors.goals ? "is-invalid" : ""
                                }`}
                                value={formData.goals ?? ""}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    goals:
                                      e.target.value === ""
                                        ? undefined
                                        : +e.target.value,
                                  })
                                }
                              />
                              {errors.goals && (
                                <div className="invalid-feedback">
                                  {errors.goals}
                                </div>
                              )}
                            </div>

                            <div className="mb-2">
                              <label className="form-label">A</label>
                              <input
                                type="number"
                                className={`form-control ${
                                  errors.assists ? "is-invalid" : ""
                                }`}
                                value={formData.assists ?? ""}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    assists:
                                      e.target.value === ""
                                        ? undefined
                                        : +e.target.value,
                                  })
                                }
                              />
                              {errors.assists && (
                                <div className="invalid-feedback">
                                  {errors.assists}
                                </div>
                              )}
                            </div>

                            <div>
                              <label className="form-label">P</label>
                              <input
                                className="form-control"
                                value={
                                  (formData.goals ?? 0) +
                                  (formData.assists ?? 0)
                                }
                                disabled
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            G: {player.goals} | A: {player.assists} | P:{" "}
                            {player.points}
                          </>
                        )
                      ) : isEditing ? (
                        <>
                          <div className="mb-2">
                            <label className="form-label">W</label>
                            <input
                              type="number"
                              className={`form-control ${
                                errors.wins ? "is-invalid" : ""
                              }`}
                              value={formData.wins ?? ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  wins:
                                    e.target.value === ""
                                      ? undefined
                                      : +e.target.value,
                                })
                              }
                            />
                            {errors.wins && (
                              <div className="invalid-feedback">
                                {errors.wins}
                              </div>
                            )}
                          </div>

                          <div className="mb-2">
                            <label className="form-label">GAA</label>
                            <input
                              type="number"
                              className={`form-control ${
                                errors.goalsAgainstAverage ? "is-invalid" : ""
                              }`}
                              step="0.01"
                              value={formData.goalsAgainstAverage ?? ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  goalsAgainstAverage:
                                    e.target.value === ""
                                      ? undefined
                                      : +e.target.value,
                                })
                              }
                            />
                            {errors.goalsAgainstAverage && (
                              <div className="invalid-feedback">
                                {errors.goalsAgainstAverage}
                              </div>
                            )}
                          </div>

                          <div>
                            <label className="form-label">SO</label>
                            <input
                              type="number"
                              className={`form-control ${
                                errors.shutouts ? "is-invalid" : ""
                              }`}
                              value={formData.shutouts ?? ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  shutouts:
                                    e.target.value === ""
                                      ? undefined
                                      : +e.target.value,
                                })
                              }
                            />
                            {errors.shutouts && (
                              <div className="invalid-feedback">
                                {errors.shutouts}
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          W: {player.wins} | GAA:{" "}
                          {player.goalsAgainstAverage?.toFixed(2)} | SO:{" "}
                          {player.shutouts}
                        </>
                      )}
                    </td>

                    <td>
                      {isEditing ? (
                        <div className="d-grid gap-2">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleSave(player._id)}>
                            Save
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              setEditingId(null);
                              setFormData({});
                              setErrors({});
                            }}>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="d-grid gap-2">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleEdit(player)}>
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(player._id)}>
                            Remove
                          </button>
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() => handleAddHighlight(player._id)}>
                            Add Highlight
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card layout for small screens */}
      <div className="d-block d-sm-none">
        {players.map((player) => {
          const isEditing = editingId === player._id;
          return (
            <div className="card mb-4 shadow rounded border-dark border-2" key={player._id}>
              <h5 className="card-header bg-warning text-black">
                {isEditing ? (
                  <input
                    className={`form-control ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    value={formData.name ?? ""}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                ) : (
                  player.name
                )}
              </h5>
              <div className="card-body bg-light rounded-bottom">
                <h6 className="card-subtitle mb-2 text-muted">
                  Position: {player.position}
                </h6>
                <p className="card-text mb-2">
                  Games Played: {player.gamesPlayed}
                </p>

                <div className="mb-3">
                  {player.position === "Skater" ? (
                    isEditing ? (
                      <>
                        <div className="mb-2">
                          <label className="form-label">Goals (G)</label>
                          <input
                            type="number"
                            className={`form-control ${
                              errors.goals ? "is-invalid" : ""
                            }`}
                            value={formData.goals ?? ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                goals:
                                  e.target.value === ""
                                    ? undefined
                                    : +e.target.value,
                              })
                            }
                          />
                          {errors.goals && (
                            <div className="invalid-feedback">
                              {errors.goals}
                            </div>
                          )}
                        </div>

                        <div className="mb-2">
                          <label className="form-label">Assists (A)</label>
                          <input
                            type="number"
                            className={`form-control ${
                              errors.assists ? "is-invalid" : ""
                            }`}
                            value={formData.assists ?? ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                assists:
                                  e.target.value === ""
                                    ? undefined
                                    : +e.target.value,
                              })
                            }
                          />
                          {errors.assists && (
                            <div className="invalid-feedback">
                              {errors.assists}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="form-label">Points (P)</label>
                          <input
                            className="form-control"
                            value={
                              (formData.goals ?? 0) + (formData.assists ?? 0)
                            }
                            disabled
                          />
                        </div>
                      </>
                    ) : (
                      <p className="card-text">
                        G: {player.goals} | A: {player.assists} | P:{" "}
                        {player.points}
                      </p>
                    )
                  ) : isEditing ? (
                    <>
                      <div className="mb-2">
                        <label className="form-label">Wins (W)</label>
                        <input
                          type="number"
                          className={`form-control ${
                            errors.wins ? "is-invalid" : ""
                          }`}
                          value={formData.wins ?? ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              wins:
                                e.target.value === ""
                                  ? undefined
                                  : +e.target.value,
                            })
                          }
                        />
                        {errors.wins && (
                          <div className="invalid-feedback">{errors.wins}</div>
                        )}
                      </div>

                      <div className="mb-2">
                        <label className="form-label">
                          Goals Against Avg (GAA)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          className={`form-control ${
                            errors.goalsAgainstAverage ? "is-invalid" : ""
                          }`}
                          value={formData.goalsAgainstAverage ?? ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              goalsAgainstAverage:
                                e.target.value === ""
                                  ? undefined
                                  : +e.target.value,
                            })
                          }
                        />
                        {errors.goalsAgainstAverage && (
                          <div className="invalid-feedback">
                            {errors.goalsAgainstAverage}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="form-label">Shutouts (SO)</label>
                        <input
                          type="number"
                          className={`form-control ${
                            errors.shutouts ? "is-invalid" : ""
                          }`}
                          value={formData.shutouts ?? ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              shutouts:
                                e.target.value === ""
                                  ? undefined
                                  : +e.target.value,
                            })
                          }
                        />
                        {errors.shutouts && (
                          <div className="invalid-feedback">
                            {errors.shutouts}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="card-text">
                      W: {player.wins} | GAA:{" "}
                      {player.goalsAgainstAverage?.toFixed(2)} | SO:{" "}
                      {player.shutouts}
                    </p>
                  )}
                </div>

                <div className="d-flex justify-content-between">
                  {isEditing ? (
                    <>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleSave(player._id)}>
                        Save
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setEditingId(null);
                          setFormData({});
                          setErrors({});
                        }}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-primary w-30"
                        onClick={() => handleEdit(player)}>
                        Edit
                      </button>
                      <button
                        className="btn btn-danger w-30"
                        onClick={() => handleDelete(player._id)}>
                        Remove
                      </button>
                      <button
                        className="btn btn-secondary w-30"
                        onClick={() => handleAddHighlight(player._id)}>
                        Add Highlight
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div id="buttons">
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/admin/new-player")}>
          Add New Player
        </button>
        <button
          className="btn btn-warning ms-2"
          onClick={() => navigate("/admin/edit-highlights")}>
          Manage Highlights
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
