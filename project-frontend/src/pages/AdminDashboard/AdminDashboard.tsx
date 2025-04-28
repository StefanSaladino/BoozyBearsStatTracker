import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "../../api";
import { AuthContext } from "../../context/AuthContext";
import { validatePlayerForm } from "../../utils/validateForm";

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
      <h1 className="mb-4">Admin Dashboard</h1>

      <table className="table table-bordered table-striped table-hover">
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
                <td>
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
                        <div className="invalid-feedback">{errors.name}</div>
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

                <td>
                  {player.position === "Skater" ? (
                    isEditing ? (
                      <>
                        <label>G</label>
                        <input
                          type="number"
                          className={`form-control mb-1 ${
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
                          <div className="invalid-feedback">{errors.goals}</div>
                        )}

                        <label>A</label>
                        <input
                          type="number"
                          className={`form-control mb-1 ${
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

                        <label>P</label>
                        <input
                          className="form-control"
                          value={
                            (formData.goals ?? 0) + (formData.assists ?? 0)
                          }
                          disabled
                        />
                      </>
                    ) : (
                      <>
                        G: {player.goals} | A: {player.assists} | P:{" "}
                        {player.points}
                      </>
                    )
                  ) : isEditing ? (
                    <>
                      <label>W</label>
                      <input
                        type="number"
                        className={`form-control mb-1 ${
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

                      <label>GAA</label>
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

                      <label>SO</label>
                      <input
                        type="number"
                        className={`form-control mb-1 ${
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
                    <>
                      <button
                        className="btn btn-success me-2"
                        onClick={() => handleSave(player._id)}>
                        Save
                      </button>
                      <button
                        className="btn btn-secondary"
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
                        className="btn btn-primary me-2"
                        onClick={() => handleEdit(player)}>
                        Edit
                      </button>
                      <button
                        className="btn btn-danger me-2"
                        onClick={() => handleDelete(player._id)}>
                        Remove
                      </button>
                      <button
                        className="btn btn-info"
                        onClick={() => handleAddHighlight(player._id)}>
                        Add Highlight
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

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
  );
};

export default AdminDashboard;
