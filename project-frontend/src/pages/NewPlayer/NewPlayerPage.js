import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api";
import { validatePlayerForm } from "../../utils/validateForm";
import ToastNotification from "../../components/ToastComponent";
const NewPlayerPage = () => {
    const [name, setName] = useState("");
    const [jerseyNumber, setJerseyNumber] = useState(0);
    const [position, setPosition] = useState("Skater");
    const [gamesPlayed, setGamesPlayed] = useState(0);
    const [goals, setGoals] = useState(0);
    const [assists, setAssists] = useState(0);
    const [wins, setWins] = useState(0);
    const [goalsAgainstAverage, setGoalsAgainstAverage] = useState(0);
    const [errors, setErrors] = useState({});
    const [showToast, setShowToast] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            name,
            jerseyNumber,
            position,
            gamesPlayed,
            goals,
            assists,
            wins,
            goalsAgainstAverage,
        };
        const validationErrors = validatePlayerForm(formData, position);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        const payload = {
            name,
            jerseyNumber,
            position,
            gamesPlayed,
        };
        if (position === "Skater") {
            payload.goals = goals;
            payload.assists = assists;
        }
        else {
            payload.wins = wins;
            payload.goalsAgainstAverage = goalsAgainstAverage;
        }
        try {
            await axios.post("/players", payload);
            setShowToast(true); // ✅ show success toast
            setTimeout(() => navigate("/admin-dashboard"), 2000);
        }
        catch (err) {
            console.error("Error creating player:", err);
        }
    };
    return (_jsxs("div", { className: "container mt-5 mb-5", children: [_jsx("div", { className: "card shadow p-4", children: _jsxs("div", { className: "card-body", children: [_jsx("h2", { className: "card-title mb-4", children: "Add New Player" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "form-label", children: "Name" }), _jsx("input", { className: `form-control ${errors.name ? "is-invalid" : ""}`, value: name, onChange: (e) => setName(e.target.value) }), errors.name && _jsx("div", { className: "invalid-feedback", children: errors.name })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "form-label", children: "Jersey Number" }), _jsx("input", { type: "number", className: `form-control ${errors.jerseyNumber ? "is-invalid" : ""}`, value: jerseyNumber, onChange: (e) => setJerseyNumber(Number(e.target.value)) }), errors.jerseyNumber && (_jsx("div", { className: "invalid-feedback", children: errors.jerseyNumber }))] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "form-label", children: "Position" }), _jsxs("select", { className: "form-select", value: position, onChange: (e) => setPosition(e.target.value), children: [_jsx("option", { value: "Skater", children: "Skater" }), _jsx("option", { value: "Goalie", children: "Goalie" })] })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "form-label", children: "Games Played" }), _jsx("input", { type: "number", className: `form-control ${errors.gamesPlayed ? "is-invalid" : ""}`, value: gamesPlayed, onChange: (e) => setGamesPlayed(Number(e.target.value)) }), errors.gamesPlayed && (_jsx("div", { className: "invalid-feedback", children: errors.gamesPlayed }))] }), position === "Skater" ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "form-label", children: "Goals" }), _jsx("input", { type: "number", className: `form-control ${errors.goals ? "is-invalid" : ""}`, value: goals, onChange: (e) => setGoals(Number(e.target.value)) }), errors.goals && (_jsx("div", { className: "invalid-feedback", children: errors.goals }))] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "form-label", children: "Assists" }), _jsx("input", { type: "number", className: `form-control ${errors.assists ? "is-invalid" : ""}`, value: assists, onChange: (e) => setAssists(Number(e.target.value)) }), errors.assists && (_jsx("div", { className: "invalid-feedback", children: errors.assists }))] })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "form-label", children: "Wins" }), _jsx("input", { type: "number", className: `form-control ${errors.wins ? "is-invalid" : ""}`, value: wins, onChange: (e) => setWins(Number(e.target.value)) }), errors.wins && (_jsx("div", { className: "invalid-feedback", children: errors.wins }))] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "form-label", children: "Goals Against Average" }), _jsx("input", { type: "number", step: "0.01", className: `form-control ${errors.goalsAgainstAverage ? "is-invalid" : ""}`, value: goalsAgainstAverage, onChange: (e) => setGoalsAgainstAverage(Number(e.target.value)) }), errors.goalsAgainstAverage && (_jsx("div", { className: "invalid-feedback", children: errors.goalsAgainstAverage }))] })] })), _jsxs("div", { className: "d-flex mt-4", children: [_jsx("button", { type: "submit", className: "btn btn-success me-3", children: "Create Player" }), _jsx("button", { type: "button", className: "btn btn-secondary", onClick: () => navigate("/admin-dashboard"), children: "Cancel" })] })] })] }) }), _jsx(ToastNotification, { show: showToast, message: "New player added successfully!", onClose: () => setShowToast(false) })] }));
};
export default NewPlayerPage;
