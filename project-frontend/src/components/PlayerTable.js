import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
// Displays a table of either skaters or goalies
const PlayerTable = ({ title, players }) => {
    const navigate = useNavigate();
    return (_jsxs(_Fragment, { children: [_jsx("h3", { children: title }), _jsxs("table", { border: 1, cellPadding: 10, cellSpacing: 0, style: { marginBottom: '2rem' }, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Name" }), _jsx("th", { children: "GP" }), title === 'Skaters' ? (_jsxs(_Fragment, { children: [_jsx("th", { children: "G" }), _jsx("th", { children: "A" }), _jsx("th", { children: "P" })] })) : (_jsxs(_Fragment, { children: [_jsx("th", { children: "W" }), _jsx("th", { children: "GAA" })] }))] }) }), _jsx("tbody", { children: players.map(player => (_jsxs("tr", { onClick: () => navigate(`/player/${player._id}`), style: { cursor: 'pointer' }, children: [_jsx("td", { children: player.name }), _jsx("td", { children: player.gamesPlayed }), title === 'Skaters' ? (_jsxs(_Fragment, { children: [_jsx("td", { children: player.goals ?? 0 }), _jsx("td", { children: player.assists ?? 0 }), _jsx("td", { children: player.points ?? 0 })] })) : (_jsxs(_Fragment, { children: [_jsx("td", { children: player.wins ?? 0 }), _jsx("td", { children: player.goalsAgainstAverage ?? 0 })] }))] }, player._id))) })] })] }));
};
export default PlayerTable;
