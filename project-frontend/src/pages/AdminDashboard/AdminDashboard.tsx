import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from '../../api';
import { AuthContext } from '../../context/AuthContext';

interface Player {
  _id: string;
  name: string;
  position: 'Skater' | 'Goalie';
  gamesPlayed: number;
  goals?: number;
  assists?: number;
  points?: number;
  wins?: number;
  goalsAgainstAverage?: number;
}

const AdminDashboard: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [players, setPlayers] = useState<Player[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Player>>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      axios.get<Player[]>('/players')
        .then(res => setPlayers(res.data))
        .catch(err => console.error('Error fetching players:', err));
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return <Navigate to="/login" />;

  const handleEdit = (player: Player) => {
    setEditingId(player._id);
    setFormData({ ...player });
  };

  const handleSave = async (id: string) => {
    try {
      await axios.put(`/players/${id}`, formData);
      const res = await axios.get<Player[]>('/players');
      setPlayers(res.data);
      setEditingId(null);
    } catch (err) {
      console.error('Error saving player:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this player?')) return;
    try {
      await axios.delete(`/players/${id}`);
      setPlayers(ps => ps.filter(p => p._id !== id));
    } catch (err) {
      console.error('Error deleting player:', err);
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
          {players.map(player => {
            const isEditing = editingId === player._id;
            return (
              <tr key={player._id}>
                <td>
                  {isEditing ? (
                    <input
                      className="form-control"
                      value={formData.name ?? ''}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  ) : (
                    player.name
                  )}
                </td>

                <td>{player.position}</td>

                <td>
                  {isEditing ? (
                    <input
                      type="number"
                      className="form-control"
                      value={formData.gamesPlayed ?? ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          gamesPlayed: e.target.value === '' ? undefined : +e.target.value
                        })
                      }
                    />
                  ) : (
                    player.gamesPlayed
                  )}
                </td>

                <td>
                  {player.position === 'Skater' ? (
                    isEditing ? (
                      <>
                        <label>G</label>
                        <input
                          type="number"
                          className="form-control mb-1"
                          value={formData.goals ?? ''}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              goals: e.target.value === '' ? undefined : +e.target.value
                            })
                          }
                        />
                        <label>A</label>
                        <input
                          type="number"
                          className="form-control mb-1"
                          value={formData.assists ?? ''}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              assists: e.target.value === '' ? undefined : +e.target.value
                            })
                          }
                        />
                        <label>P</label>
                        <input
                          className="form-control"
                          value={(formData.goals ?? 0) + (formData.assists ?? 0)}
                          disabled
                        />
                      </>
                    ) : (
                      <>
                        G: {player.goals} | A: {player.assists} | P: {player.points}
                      </>
                    )
                  ) : isEditing ? (
                    <>
                      <label>W</label>
                      <input
                        type="number"
                        className="form-control mb-1"
                        value={formData.wins ?? ''}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            wins: e.target.value === '' ? undefined : +e.target.value
                          })
                        }
                      />
                      <label>GAA</label>
                      <input
                        type="number"
                        className="form-control"
                        step="0.01"
                        value={formData.goalsAgainstAverage ?? ''}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            goalsAgainstAverage: e.target.value === '' ? undefined : +e.target.value
                          })
                        }
                      />
                    </>
                  ) : (
                    <>
                      W: {player.wins} | GAA: {player.goalsAgainstAverage}
                    </>
                  )}
                </td>

                <td>
                  {isEditing ? (
                    <button className="btn btn-success" onClick={() => handleSave(player._id)}>Save</button>
                  ) : (
                    <button className="btn btn-primary" onClick={() => handleEdit(player)}>Edit</button>
                  )}
                  {' '}
                  <button className="btn btn-danger" onClick={() => handleDelete(player._id)}>Remove</button>
                  {' '}
                  <button className="btn btn-info" onClick={() => handleAddHighlight(player._id)}>Add Highlight</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <button
        className="btn btn-secondary"
        onClick={() => navigate('/admin/new-player')}
      >
        Add New Player
      </button>
    </div>
  );
};

export default AdminDashboard;
