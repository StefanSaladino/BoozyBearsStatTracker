// src/components/PlayerTable.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Player } from '../types';

interface PlayerTableProps {
  title: 'Skaters' | 'Goalies';
  players: Player[];
}

// Displays a table of either skaters or goalies
const PlayerTable: React.FC<PlayerTableProps> = ({ title, players }) => {
  const navigate = useNavigate();

  return (
    <>
      <h3>{title}</h3>
      <table border={1} cellPadding={10} cellSpacing={0} style={{ marginBottom: '2rem' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>GP</th>
            {title === 'Skaters' ? (
              <>
                <th>G</th>
                <th>A</th>
                <th>P</th>
              </>
            ) : (
              <>
                <th>W</th>
                <th>GAA</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {players.map(player => (
            <tr
              key={player._id}
              onClick={() => navigate(`/player/${player._id}`)}
              style={{ cursor: 'pointer' }}
            >
              <td>{player.name}</td>
              <td>{player.gamesPlayed}</td>
              {title === 'Skaters' ? (
                <>
                  <td>{player.goals ?? 0}</td>
                  <td>{player.assists ?? 0}</td>
                  <td>{player.points ?? 0}</td>
                </>
              ) : (
                <>
                  <td>{player.wins ?? 0}</td>
                  <td>{player.goalsAgainstAverage ?? 0}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default PlayerTable;
