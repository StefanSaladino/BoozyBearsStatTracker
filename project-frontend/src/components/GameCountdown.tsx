// GameCountdown.tsx

import { useEffect, useState } from 'react';
import { gameSchedule } from '../countdownData';
import '../components/GameCountdown.css';

interface Game {
  date: string;
  opponent: string;
}

const GameCountdown = () => {
  const [nextGame, setNextGame] = useState<Game | null>(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [isClose, setIsClose] = useState(false);

  useEffect(() => {
    const findNextGame = () => {
      const now = new Date();
      const upcoming = gameSchedule.find(game => new Date(game.date) > now);
      setNextGame(upcoming || null);
    };

    const updateCountdown = () => {
      if (!nextGame) return;

      const now = new Date();
      const gameTime = new Date(nextGame.date);
      const diff = gameTime.getTime() - now.getTime();

      if (diff <= 0) {
        findNextGame(); // refresh for next game
        return;
      }

      setIsClose(diff <= 24 * 60 * 60 * 1000); // less than 24 hours

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    findNextGame();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [nextGame]);

  if (!nextGame) {
    return (
      <div className="countdown-wrapper">
        <div className="countdown-container">
          <h2>No Games Scheduled</h2>
        </div>
      </div>
    );
  }

  return (
    <div className='countdown-wrapper'>
      <div className={`countdown-container ${isClose ? 'hype-mode' : ''}`}>
        <h2>Next Game:</h2>
        <p className="opponent">
          <span className='text-success fw-bold fs-1'>Boozy Bears</span> VS.{' '}
          <span className='text-danger fw-bold fs-1'>{nextGame.opponent}</span>
        </p>
        <p key={timeLeft} className="time-left slide-in">
          {timeLeft}
        </p>
      </div>
    </div>
  );
};

export default GameCountdown;
