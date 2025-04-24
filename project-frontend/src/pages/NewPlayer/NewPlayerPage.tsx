import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api';

const NewPlayerPage: React.FC = () => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState<'Skater' | 'Goalie'>('Skater');
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [goals, setGoals] = useState(0);
  const [assists, setAssists] = useState(0);
  const [wins, setWins] = useState(0);
  const [goalsAgainstAverage, setGoalsAgainstAverage] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      navigate('/admin-dashboard');
    } catch (err) {
      console.error('Error creating player:', err);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4">Add New Player</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input className="form-control" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Position</label>
          <select
            className="form-select"
            value={position}
            onChange={e => setPosition(e.target.value as 'Skater' | 'Goalie')}
          >
            <option value="Skater">Skater</option>
            <option value="Goalie">Goalie</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Games Played</label>
          <input
            type="number"
            className="form-control"
            value={gamesPlayed}
            onChange={e => setGamesPlayed(+e.target.value)}
          />
        </div>

        {position === 'Skater' ? (
          <>
            <div className="mb-3">
              <label className="form-label">Goals</label>
              <input
                type="number"
                className="form-control"
                value={goals}
                onChange={e => setGoals(+e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Assists</label>
              <input
                type="number"
                className="form-control"
                value={assists}
                onChange={e => setAssists(+e.target.value)}
              />
            </div>
          </>
        ) : (
          <>
            <div className="mb-3">
              <label className="form-label">Wins</label>
              <input
                type="number"
                className="form-control"
                value={wins}
                onChange={e => setWins(+e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">GAA</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={goalsAgainstAverage}
                onChange={e => setGoalsAgainstAverage(+e.target.value)}
              />
            </div>
          </>
        )}
        <button type="submit" className="btn btn-success mt-3">Create Player</button>
      </form>
    </div>
  );
};

export default NewPlayerPage;
