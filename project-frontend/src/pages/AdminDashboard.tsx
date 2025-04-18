import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';

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
  const [players, setPlayers] = useState<Player[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Player>>({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get<Player[]>('/players')
      .then(res => setPlayers(res.data))
      .catch(err => console.error('Error fetching players:', err));
  }, []);

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
    <div style={{ padding: '2rem' }}>
      <h1>Admin Dashboard</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
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
              <tr key={player._id} style={{ borderBottom: '1px solid #ccc' }}>
                {/* NAME */}
                <td>
                  {isEditing ? (
                    <input
                      value={formData.name ?? ''}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  ) : (
                    player.name
                  )}
                </td>

                {/* POSITION */}
                <td>{player.position}</td>

                {/* GAMES PLAYED */}
                <td>
                  {isEditing ? (
                    <input
                      type="number"
                      value={formData.gamesPlayed ?? ''}
                      onChange={e => setFormData({
                        ...formData,
                        gamesPlayed: e.target.value === '' ? undefined : +e.target.value
                      })}
                      style={{ width: '4rem' }}
                    />
                  ) : (
                    player.gamesPlayed
                  )}
                </td>

                {/* VARIABLE STATS */}
                <td>
                  {player.position === 'Skater' ? (
                    isEditing ? (
                      <>
                        G:{' '}
                        <input
                          type="number"
                          value={formData.goals ?? ''}
                          onChange={e => setFormData({
                            ...formData,
                            goals: e.target.value === '' ? undefined : +e.target.value
                          })}
                          style={{ width: '3rem' }}
                        />{' '}
                        A:{' '}
                        <input
                          type="number"
                          value={formData.assists ?? ''}
                          onChange={e => setFormData({
                            ...formData,
                            assists: e.target.value === '' ? undefined : +e.target.value
                          })}
                          style={{ width: '3rem' }}
                        />{' '}
                        P:{' '}
                        {( (formData.goals ?? 0) + (formData.assists ?? 0) )}
                      </>
                    ) : (
                      <>
                        G: {player.goals} | A: {player.assists} | P: {player.points}
                      </>
                    )
                  ) : (
                    isEditing ? (
                      <>
                        W:{' '}
                        <input
                          type="number"
                          value={formData.wins ?? ''}
                          onChange={e => setFormData({
                            ...formData,
                            wins: e.target.value === '' ? undefined : +e.target.value
                          })}
                          style={{ width: '3rem' }}
                        />{' '}
                        GAA:{' '}
                        <input
                          type="number"
                          step="0.01"
                          value={formData.goalsAgainstAverage ?? ''}
                          onChange={e => setFormData({
                            ...formData,
                            goalsAgainstAverage: e.target.value === '' ? undefined : +e.target.value
                          })}
                          style={{ width: '4rem' }}
                        />
                      </>
                    ) : (
                      <>
                        W: {player.wins} | GAA: {player.goalsAgainstAverage}
                      </>
                    )
                  )}
                </td>

                {/* ACTIONS */}
                <td>
                  {isEditing ? (
                    <button onClick={() => handleSave(player._id)}>Save</button>
                  ) : (
                    <button onClick={() => handleEdit(player)}>Edit</button>
                  )}{' '}
                  <button onClick={() => handleDelete(player._id)}>Remove</button>{' '}
                  <button onClick={() => handleAddHighlight(player._id)}>Add Highlight</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <button
        onClick={() => navigate('/admin/new-player')}
        style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
      >
        Add New Player
      </button>
    </div>
  );
};

export default AdminDashboard;
