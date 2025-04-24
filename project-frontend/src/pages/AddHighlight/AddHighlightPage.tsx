import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api';

interface PlayerOption {
  _id: string;
  name: string;
}

const AddHighlightPage: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const [players, setPlayers] = useState<PlayerOption[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState(playerId || '');
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [gameDate, setGameDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get<PlayerOption[]>('/players')
      .then(res => setPlayers(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedPlayer) return;

    const form = new FormData();
    form.append('video', file);
    form.append('description', description);
    form.append('gameDate', gameDate);

    try {
      await axios.post(`/players/${selectedPlayer}/highlight`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/admin-dashboard');
    } catch (err) {
      console.error('Error uploading highlight:', err);
    }
  };

  return (
    <div className="container mt-5 pb-4">
      <h2 className="mb-4">Add Highlight Video</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Player</label>
          <select
            className="form-select"
            value={selectedPlayer}
            onChange={e => setSelectedPlayer(e.target.value)}
            required
          >
            <option value="">-- Select Player --</option>
            {players.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Video File</label>
          <input
            className="form-control"
            type="file"
            accept="video/*"
            onChange={e => setFile(e.target.files?.[0] || null)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <input
            className="form-control"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Game Date</label>
          <input
            className="form-control"
            type="date"
            value={gameDate}
            onChange={e => setGameDate(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary mt-2">
          Upload Highlight
        </button>
      </form>
    </div>
  );
};

export default AddHighlightPage;
