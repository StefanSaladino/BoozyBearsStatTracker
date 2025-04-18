import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api';

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
    // Fetch list of players for dropdown
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
      navigate('/admin');
    } catch (err) {
      console.error('Error uploading highlight:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
      <h2>Add Highlight Video</h2>
      <div>
        <label>Player:</label>{' '}
        <select value={selectedPlayer} onChange={e => setSelectedPlayer(e.target.value)}>
          <option value="">-- Select Player --</option>
          {players.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
      </div>
      <div>
        <label>Video File:</label>{' '}
        <input type="file" accept="video/*" onChange={e => setFile(e.target.files?.[0] || null)} required />
      </div>
      <div>
        <label>Description:</label>{' '}
        <input value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <div>
        <label>Game Date:</label>{' '}
        <input type="date" value={gameDate} onChange={e => setGameDate(e.target.value)} />
      </div>
      <button type="submit" style={{ marginTop: '1rem' }}>Upload Highlight</button>
    </form>
  );
};

export default AddHighlightPage;
