import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api';

const NewPlayerPage: React.FC = () => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState<'Skater'|'Goalie'>('Skater');
  // Stats fields
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [goals, setGoals] = useState(0);
  const [assists, setAssists] = useState(0);
  const [wins, setWins] = useState(0);
  const [goalsAgainstAverage, setGoalsAgainstAverage] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Build payload for POST /players
    const payload: any = { name, position, gamesPlayed };
    if (position === 'Skater') {
      payload.goals = goals;
      payload.assists = assists;
    } else {
      payload.wins = wins;
      payload.goalsAgainstAverage = goalsAgainstAverage;
    }
    try {
      await axios.post('/players', payload);
      navigate('/admin'); // Back to dashboard
    } catch (err) {
      console.error('Error creating player:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
      <h2>Add New Player</h2>
      <div>
        <label>Name:</label>{' '}
        <input value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div>
        <label>Position:</label>{' '}
        <select value={position} onChange={e => setPosition(e.target.value as any)}>
          <option value="Skater">Skater</option>
          <option value="Goalie">Goalie</option>
        </select>
      </div>
      <div>
        <label>Games Played:</label>{' '}
        <input type="number" value={gamesPlayed} onChange={e => setGamesPlayed(+e.target.value)} />
      </div>
      {position === 'Skater' ? (
        <>
          <div>
            <label>Goals:</label>{' '}
            <input type="number" value={goals} onChange={e => setGoals(+e.target.value)} />
          </div>
          <div>
            <label>Assists:</label>{' '}
            <input type="number" value={assists} onChange={e => setAssists(+e.target.value)} />
          </div>
        </>
      ) : (
        <>
          <div>
            <label>Wins:</label>{' '}
            <input type="number" value={wins} onChange={e => setWins(+e.target.value)} />
          </div>
          <div>
            <label>GAA:</label>{' '}
            <input type="number" step="0.01" value={goalsAgainstAverage} onChange={e => setGoalsAgainstAverage(+e.target.value)} />
          </div>
        </>
      )}
      <button type="submit" style={{ marginTop: '1rem' }}>Create Player</button>
    </form>
  );
};

export default NewPlayerPage;
