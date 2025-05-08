import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/AddHighlight/AddHighlightPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api";
import { validateHighlightForm } from "../../utils/validateForm";
import ToastNotification from "../../components/ToastComponent";
const AddHighlightPage = () => {
    const { playerId } = useParams();
    const [players, setPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(playerId || "");
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [description, setDescription] = useState("");
    const [gameDate, setGameDate] = useState("");
    const [errors, setErrors] = useState({});
    const [showToast, setShowToast] = useState(false);
    const navigate = useNavigate();
    // load players list for dropdown
    useEffect(() => {
        axios
            .get("/players")
            .then((res) => setPlayers(res.data))
            .catch((err) => console.error("Failed to load players:", err));
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        // validate against new signature
        const validationErrors = validateHighlightForm({
            selectedPlayer,
            youtubeUrl,
            description,
            gameDate,
        });
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        try {
            // POST /api/videos/:playerId expects { youtubeUrl, description, gameDate }
            await axios.post(`/api/videos/${selectedPlayer}`, {
                youtubeUrl,
                description,
                gameDate,
            });
            setShowToast(true);
            setTimeout(() => navigate("/admin-dashboard"), 2000);
        }
        catch (err) {
            console.error("Error adding highlight:", err);
        }
    };
    return (_jsxs("div", { className: "container mt-5 pb-4", children: [_jsxs("div", { className: "card shadow p-4", children: [_jsx("h2", { className: "mb-4", children: "Add Highlight Video" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "row gx-3", children: [_jsxs("div", { className: "col-md-6 mb-3", children: [_jsx("label", { className: "form-label", children: "Player" }), _jsxs("select", { className: `form-select ${errors.selectedPlayer ? "is-invalid" : ""}`, value: selectedPlayer, onChange: (e) => setSelectedPlayer(e.target.value), children: [_jsx("option", { value: "", children: "-- Select Player --" }), players.map((p) => (_jsx("option", { value: p._id, children: p.name }, p._id)))] }), errors.selectedPlayer && (_jsx("div", { className: "invalid-feedback", children: errors.selectedPlayer }))] }), _jsxs("div", { className: "col-md-6 mb-3", children: [_jsx("label", { className: "form-label", children: "YouTube URL" }), _jsx("input", { type: "url", className: `form-control ${errors.youtubeUrl ? "is-invalid" : ""}`, placeholder: "https://www.youtube.com/watch?v=...", value: youtubeUrl, onChange: (e) => setYoutubeUrl(e.target.value) }), errors.youtubeUrl && (_jsx("div", { className: "invalid-feedback", children: errors.youtubeUrl }))] }), _jsxs("div", { className: "col-md-6 mb-3", children: [_jsx("label", { className: "form-label", children: "Description" }), _jsx("input", { type: "text", className: `form-control ${errors.description ? "is-invalid" : ""}`, value: description, onChange: (e) => setDescription(e.target.value) }), errors.description && (_jsx("div", { className: "invalid-feedback", children: errors.description }))] }), _jsxs("div", { className: "col-md-6 mb-3", children: [_jsx("label", { className: "form-label", children: "Game Date" }), _jsx("input", { type: "date", className: `form-control ${errors.gameDate ? "is-invalid" : ""}`, value: gameDate, onChange: (e) => setGameDate(e.target.value) }), errors.gameDate && (_jsx("div", { className: "invalid-feedback", children: errors.gameDate }))] })] }), _jsx("button", { type: "submit", className: "btn btn-primary mt-3 me-2", children: "Submit Highlight" }), _jsx("button", { type: "button", className: "btn btn-secondary mt-3", onClick: () => navigate("/admin-dashboard"), children: "Cancel" })] })] }), _jsx(ToastNotification, { show: showToast, message: "Highlight added successfully!", onClose: () => setShowToast(false) })] }));
};
export default AddHighlightPage;
