import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// GameCountdown.tsx
import { useEffect, useState } from 'react';
import { gameSchedule } from '../countdownData';
import '../components/GameCountdown.css';
const GameCountdown = () => {
    const [nextGame, setNextGame] = useState(null);
    const [timeLeft, setTimeLeft] = useState('');
    const [isClose, setIsClose] = useState(false);
    useEffect(() => {
        const findNextGame = () => {
            const now = new Date();
            const upcoming = gameSchedule.find(game => new Date(game.date) > now);
            setNextGame(upcoming || null);
        };
        const updateCountdown = () => {
            if (!nextGame)
                return;
            const now = new Date();
            const gameTime = new Date(nextGame.date);
            const diff = gameTime.getTime() - now.getTime();
            if (diff <= 0) {
                findNextGame();
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
        return _jsx("div", { className: "countdown-container", children: "No upcoming games!" });
    }
    return (_jsx("div", { className: 'countdown-wrapper', children: _jsxs("div", { className: `countdown-container ${isClose ? 'hype-mode' : ''}`, children: [_jsx("h2", { children: "Next Game:" }), _jsxs("p", { className: "opponent", children: [_jsx("span", { className: 'text-success fw-bold fs-1', children: "Boozy Bears" }), " VS. ", _jsx("span", { className: 'text-danger fw-bold fs-1', children: nextGame.opponent })] }), _jsx("p", { className: "time-left slide-in", children: timeLeft }, timeLeft)] }) }));
};
export default GameCountdown;
