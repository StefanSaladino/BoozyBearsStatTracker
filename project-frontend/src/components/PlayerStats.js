import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// Displays detailed stats of a player
const PlayerStats = ({ player }) => {
    return (_jsxs("section", { children: [_jsx("h2", { children: player.name }), _jsxs("p", { children: ["Position: ", player.position] }), _jsxs("ul", { children: [_jsxs("li", { children: ["Games Played: ", player.gamesPlayed] }), player.position === 'Skater' ? (_jsxs(_Fragment, { children: [_jsxs("li", { children: ["Goals: ", player.goals] }), _jsxs("li", { children: ["Assists: ", player.assists] }), _jsxs("li", { children: ["Points: ", player.points] })] })) : (_jsxs(_Fragment, { children: [_jsxs("li", { children: ["Wins: ", player.wins] }), _jsxs("li", { children: ["GAA: ", player.goalsAgainstAverage] })] }))] })] }));
};
export default PlayerStats;
