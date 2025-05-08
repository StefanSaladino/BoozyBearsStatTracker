import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import axios from '../../api';
import { Link } from 'react-router-dom';
import '../Roster/RosterPage.css';
import mainLogo from '../../assets/main-logo.png';
function RosterPage() {
    const [skaters, setSkaters] = useState([]);
    const [goalies, setGoalies] = useState([]);
    const [loading, setLoading] = useState(true);
    // Sorting state for skaters
    const [sortConfigSkater, setSortConfigSkater] = useState({ key: 'name', direction: 'asc' });
    // Sorting state for goalies
    const [sortConfigGoalie, setSortConfigGoalie] = useState({ key: 'name', direction: 'asc' });
    // Fetch players on mount
    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await axios.get('/players');
                const players = response.data;
                setSkaters(players.filter(p => p.position === 'Skater'));
                setGoalies(players.filter(p => p.position === 'Goalie'));
            }
            catch (error) {
                console.error('❌ Error fetching players:', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchPlayers();
    }, []);
    /**
     * Sorts players based on a key and direction.
     * Only works for numeric or string fields.
     */
    const sortPlayers = (players, config) => {
        const sorted = [...players].sort((a, b) => {
            const aVal = a[config.key];
            const bVal = b[config.key];
            // Handle undefined values by treating them as lowest
            if (aVal === undefined)
                return 1;
            if (bVal === undefined)
                return -1;
            // Compare string or number values
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return config.direction === 'asc'
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }
            else if (typeof aVal === 'number' && typeof bVal === 'number') {
                return config.direction === 'asc' ? aVal - bVal : bVal - aVal;
            }
            return 0;
        });
        return sorted;
    };
    // Update skater sort config
    const handleSkaterSort = (key) => {
        setSortConfigSkater(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };
    // Update goalie sort config
    const handleGoalieSort = (key) => {
        setSortConfigGoalie(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };
    if (loading)
        return _jsx("p", { children: "Loading roster..." });
    return (_jsxs("div", { className: "roster-page", children: [_jsxs("div", { className: 'rosterBar', children: [_jsx("img", { src: mainLogo, alt: "Boozy Bears Logo" }), _jsx("h1", { children: "Boozy Bears Roster" })] }), _jsx("h2", { children: "Skaters" }), _jsxs("table", { className: "players-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "#" }), _jsx("th", { className: "sortable", onClick: () => handleSkaterSort('name'), children: "Name" }), _jsx("th", { className: "sortable", onClick: () => handleSkaterSort('gamesPlayed'), children: "GP" }), _jsx("th", { className: "sortable", onClick: () => handleSkaterSort('goals'), children: "G" }), _jsx("th", { className: "sortable", onClick: () => handleSkaterSort('assists'), children: "A" }), _jsx("th", { className: "sortable", onClick: () => handleSkaterSort('points'), children: "P" })] }) }), _jsx("tbody", { children: sortPlayers(skaters, sortConfigSkater).map(player => (_jsxs("tr", { children: [_jsx("td", { children: player.jerseyNumber }), _jsx("td", { children: _jsx(Link, { to: `/players/${player._id}`, children: player.name }) }), _jsx("td", { children: player.gamesPlayed }), _jsx("td", { children: player.goals ?? 0 }), _jsx("td", { children: player.assists ?? 0 }), _jsx("td", { children: player.points ?? 0 })] }, player._id))) })] }), _jsx("h2", { children: "Goalies" }), _jsxs("table", { className: "players-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "#" }), _jsx("th", { className: "sortable", onClick: () => handleGoalieSort('name'), children: "Name" }), _jsx("th", { className: "sortable", onClick: () => handleGoalieSort('gamesPlayed'), children: "GP" }), _jsx("th", { className: "sortable", onClick: () => handleGoalieSort('wins'), children: "W" }), _jsx("th", { className: "sortable", onClick: () => handleGoalieSort('goalsAgainstAverage'), children: "GAA" }), _jsx("th", { className: "sortable", onClick: () => handleGoalieSort('shutouts'), children: "SO" })] }) }), _jsx("tbody", { children: sortPlayers(goalies, sortConfigGoalie).map(player => (_jsxs("tr", { children: [_jsx("td", { children: player.jerseyNumber }), _jsx("td", { children: _jsx(Link, { to: `/players/${player._id}`, children: player.name }) }), _jsx("td", { children: player.gamesPlayed }), _jsx("td", { children: player.wins ?? 0 }), _jsx("td", { children: player.goalsAgainstAverage?.toFixed(2) ?? '0.00' ?? 'N/A' }), _jsx("td", { children: player.shutouts ?? 0 })] }, player._id))) })] })] }));
}
export default RosterPage;
