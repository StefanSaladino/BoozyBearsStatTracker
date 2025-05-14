import { useEffect, useState } from 'react';
import axios from '../../api';
import { Link } from 'react-router-dom';
import '../Roster/RosterPage.css';
import mainLogo from '../../assets/main-logo.png'

// Type definition for a player
interface Player {
  _id: string;
  name: string;
  jerseyNumber: number;
  position: 'Skater' | 'Goalie';
  gamesPlayed: number;
  goals?: number;
  assists?: number;
  points?: number;
  wins?: number;
  goalsAgainstAverage?: number;
  shutouts?: number;
}

// Limit allowed keys to only sortable
type SortableSkaterKey = keyof Pick<Player, 'name' | 'gamesPlayed' | 'goals' | 'assists' | 'points'>;
type SortableGoalieKey = keyof Pick<Player, 'name' | 'gamesPlayed' | 'wins' | 'goalsAgainstAverage' | 'shutouts'>;

function RosterPage() {
  const [skaters, setSkaters] = useState<Player[]>([]);
  const [goalies, setGoalies] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  // Sorting state for skaters
  const [sortConfigSkater, setSortConfigSkater] = useState<{
    key: SortableSkaterKey;
    direction: 'asc' | 'desc';
  }>({ key: 'name', direction: 'asc' });

  // Sorting state for goalies
  const [sortConfigGoalie, setSortConfigGoalie] = useState<{
    key: SortableGoalieKey;
    direction: 'asc' | 'desc';
  }>({ key: 'name', direction: 'asc' });

  // Fetch players on mount
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get('/players');
        const players: Player[] = response.data;

        setSkaters(players.filter(p => p.position === 'Skater'));
        setGoalies(players.filter(p => p.position === 'Goalie'));
      } catch (error) {
        console.error('❌ Error fetching players:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  /**
   * Sorts players based on a key and direction.
   * Only works for numeric or string fields.
   */
  const sortPlayers = <T extends Player>(
    players: T[],
    config: { key: keyof T; direction: 'asc' | 'desc' }
  ): T[] => {
    const sorted = [...players].sort((a, b) => {
      const aVal = a[config.key];
      const bVal = b[config.key];

      // Handle undefined values by treating them as lowest
      if (aVal === undefined) return 1;
      if (bVal === undefined) return -1;

      // Compare string or number values
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return config.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        return config.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

    return sorted;
  };

  // Update skater sort config
  const handleSkaterSort = (key: SortableSkaterKey) => {
    setSortConfigSkater(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Update goalie sort config
  const handleGoalieSort = (key: SortableGoalieKey) => {
    setSortConfigGoalie(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  if (loading) return <p>Loading roster...</p>;

  return (
    <div className="roster-page">
      <div className='rosterBar'>
        <img src={mainLogo} alt="Boozy Bears Logo" />
        <h1>Boozy Bears Roster</h1>
      </div>

      <h2>Skaters</h2>
      <div className="table-container">
      <table className="players-table">
        <thead>
          <tr>
            <th>#</th>
            <th className="sortable" onClick={() => handleSkaterSort('name')}>Name</th>
            <th className="sortable" onClick={() => handleSkaterSort('gamesPlayed')}>GP</th>
            <th className="sortable" onClick={() => handleSkaterSort('goals')}>G</th>
            <th className="sortable" onClick={() => handleSkaterSort('assists')}>A</th>
            <th className="sortable" onClick={() => handleSkaterSort('points')}>P</th>
          </tr>
        </thead>
        <tbody>
          {sortPlayers(skaters, sortConfigSkater).map(player => (
            <tr key={player._id}>
              <td>{player.jerseyNumber}</td>
              <td><Link to={`/players/${player._id}`}>{player.name}</Link></td>
              <td>{player.gamesPlayed}</td>
              <td>{player.goals ?? 0}</td>
              <td>{player.assists ?? 0}</td>
              <td>{player.points ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <h2>Goalies</h2>
      <div className="table-container">
      <table className="players-table">
        <thead>
          <tr>
            <th>#</th>
            <th className="sortable" onClick={() => handleGoalieSort('name')}>Name</th>
            <th className="sortable" onClick={() => handleGoalieSort('gamesPlayed')}>GP</th>
            <th className="sortable" onClick={() => handleGoalieSort('wins')}>W</th>
            <th className="sortable" onClick={() => handleGoalieSort('goalsAgainstAverage')}>GAA</th>
            <th className="sortable" onClick={() => handleGoalieSort('shutouts')}>SO</th>
          </tr>
        </thead>
        <tbody>
          {sortPlayers(goalies, sortConfigGoalie).map(player => (
            <tr key={player._id}>
              <td>{player.jerseyNumber}</td>
              <td><Link to={`/players/${player._id}`}>{player.name}</Link></td>
              <td>{player.gamesPlayed}</td>
              <td>{player.wins ?? 0}</td>
              <td>{player.goalsAgainstAverage?.toFixed(2) ?? '0.00' ?? 'N/A'}</td>
              <td>{player.shutouts ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default RosterPage;
