// src/components/PlayerStats.tsx
import React from 'react';
import { Player } from '../types';

interface Props {
  player: Player;
}

// Displays detailed stats of a player
const PlayerStats: React.FC<Props> = ({ player }) => {
  return (
    <section>
      <h2>{player.name}</h2>
      <p>Position: {player.position}</p>
      <ul>
        <li>Games Played: {player.gamesPlayed}</li>
        {player.position === 'Skater' ? (
          <>
            <li>Goals: {player.goals}</li>
            <li>Assists: {player.assists}</li>
            <li>Points: {player.points}</li>
          </>
        ) : (
          <>
            <li>Wins: {player.wins}</li>
            <li>GAA: {player.goalsAgainstAverage}</li>
          </>
        )}
      </ul>
    </section>
  );
};

export default PlayerStats;
