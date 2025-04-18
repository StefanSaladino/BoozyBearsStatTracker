import { useEffect, useState } from 'react';
import axios from '../api';
import { Link } from 'react-router-dom';
// import './RosterPage.css';

// Type definition for a player
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

function RosterPage() {
  const [skaters, setSkaters] = useState<Player[]>([]);
  const [goalies, setGoalies] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch players from the backend API on component mount
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get('/players');
        const players: Player[] = response.data;

        // Separate players into skaters and goalies
        const skaterList = players.filter(p => p.position === 'Skater');
        const goalieList = players.filter(p => p.position === 'Goalie');

        setSkaters(skaterList);
        setGoalies(goalieList);
      } catch (error) {
        console.error('❌ Error fetching players:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  if (loading) return <p>Loading roster...</p>;

  return (
    <div className="roster-page">
      <h2>Skaters</h2>
      <table className="players-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>GP</th>
            <th>G</th>
            <th>A</th>
            <th>P</th>
          </tr>
        </thead>
        <tbody>
          {skaters.map(player => (
            <tr key={player._id}>
              <td>
                <Link to={`/players/${player._id}`}>{player.name}</Link>
              </td>
              <td>{player.gamesPlayed}</td>
              <td>{player.goals ?? 0}</td>
              <td>{player.assists ?? 0}</td>
              <td>{player.points ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Goalies</h2>
      <table className="players-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>GP</th>
            <th>W</th>
            <th>GAA</th>
          </tr>
        </thead>
        <tbody>
          {goalies.map(player => (
            <tr key={player._id}>
              <td>
                <Link to={`/players/${player._id}`}>{player.name}</Link>
              </td>
              <td>{player.gamesPlayed}</td>
              <td>{player.wins ?? 0}</td>
              <td>{player.goalsAgainstAverage ?? 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RosterPage;
