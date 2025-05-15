import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api';
import '../PlayerDetail/PlayerDetail.css';
import Spinner from '../../components/Spinner';
const PlayerDetailPage = () => {
    const { id } = useParams();
    const [player, setPlayer] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchPlayer = async () => {
            try {
                const response = await axios.get(`/players/${id}`);
                setPlayer(response.data);
            }
            catch (error) {
                console.error('❌ Error fetching player:', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchPlayer();
    }, [id]);
    if (loading)
        return _jsx(Spinner, {});
    if (!player)
        return _jsx("div", { className: "text-center mt-5 text-danger", children: "Player not found." });
    return (_jsxs("div", { className: "container my-5", children: [_jsxs("div", { className: "mb-4", children: [_jsxs("h2", { className: "fw-bold text-dark", children: ["#", _jsx("span", { children: player.jerseyNumber }), " ", player.name] }), _jsxs("h5", { className: "text-info-emphasis", children: ["Position: ", player.position] })] }), _jsxs("div", { className: "stat-bar bg-light border rounded shadow-sm p-3 mb-5", children: [_jsx("h4", { className: "mb-3 border-bottom pb-2 text-primary text-start", children: player.name }), _jsxs("div", { className: "stat-item-container", children: [_jsx(StatItem, { label: "Games Played", value: player.gamesPlayed }), player.position === 'Skater' && (_jsxs(_Fragment, { children: [_jsx(StatItem, { label: "Goals", value: player.goals }), _jsx(StatItem, { label: "Assists", value: player.assists }), _jsx(StatItem, { label: "Points", value: player.points })] })), player.position === 'Goalie' && (_jsxs(_Fragment, { children: [_jsx(StatItem, { label: "Wins", value: player.wins }), _jsx(StatItem, { label: "GAA", value: player.goalsAgainstAverage }), _jsx(StatItem, { label: "Shutouts", value: player.shutouts })] }))] })] }), _jsxs("div", { children: [_jsx("h4", { className: "mb-4 text-primary", children: "Highlight Videos" }), player.highlightVideos.length > 0 ? (_jsx("div", { className: "row g-4", children: player.highlightVideos.map((video) => (_jsx("div", { className: "col-md-6 col-lg-4", children: _jsxs("div", { className: "card h-100 border-0 shadow rounded", children: [_jsx("div", { className: "ratio ratio-16x9", children: _jsx("iframe", { className: "card-img-top rounded-top", src: convertYouTubeUrlToEmbed(video.youtubeUrl), title: "Highlight video", allowFullScreen: true }) }), _jsxs("div", { className: "card-body bg-white", children: [_jsxs("p", { className: "card-text mb-2 text-dark", children: [_jsx("strong", { children: "Description:" }), " ", video.description] }), _jsxs("p", { className: "card-text text-muted", children: [_jsx("strong", { children: "Date:" }), " ", new Date(video.gameDate).toLocaleDateString()] })] })] }) }, video._id))) })) : (_jsx("p", { className: "text-muted fst-italic", children: "No highlight videos available for this player." }))] })] }));
};
// Reusable stat item
const StatItem = ({ label, value }) => (_jsxs("div", { className: "stat-item", children: [_jsxs("span", { className: "stat-label", children: [label, ":"] }), ' ', _jsx("span", { className: "stat-value", children: value !== undefined ? (label === 'GAA' ? value.toFixed(2) : value) : '—' })] }));
// Converts a standard YouTube URL to an embeddable one
function convertYouTubeUrlToEmbed(url) {
    const regex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/;
    const match = url.match(regex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : '';
}
export default PlayerDetailPage;
