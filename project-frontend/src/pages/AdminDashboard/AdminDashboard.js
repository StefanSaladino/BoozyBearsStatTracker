import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "../../api";
import { AuthContext } from "../../context/AuthContext";
import { validatePlayerForm } from "../../utils/validateForm";
import "../AdminDashboard/AdminDashboard.css";
const AdminDashboard = () => {
    const { isAuthenticated, loading } = useContext(AuthContext);
    const [players, setPlayers] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
        if (isAuthenticated) {
            axios
                .get("/players")
                .then((res) => setPlayers(res.data))
                .catch((err) => console.error("Error fetching players:", err));
        }
    }, [isAuthenticated]);
    if (loading) {
        return _jsx("div", { children: "Loading..." });
    }
    if (!isAuthenticated)
        return _jsx(Navigate, { to: "/login" }); // Redirect if not authenticated
    const handleEdit = (player) => {
        setEditingId(player._id);
        setFormData({ ...player });
        setErrors({});
    };
    const handleSave = async (id) => {
        const validationErrors = validatePlayerForm(formData, formData.position);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        try {
            await axios.put(`/players/${id}`, formData);
            const res = await axios.get("/players");
            setPlayers(res.data);
            setEditingId(null);
            setFormData({});
            setErrors({});
        }
        catch (err) {
            console.error("Error saving player:", err);
        }
    };
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this player?"))
            return;
        try {
            await axios.delete(`/players/${id}`);
            setPlayers((ps) => ps.filter((p) => p._id !== id));
        }
        catch (err) {
            console.error("Error deleting player:", err);
        }
    };
    const handleAddHighlight = (id) => {
        navigate(`/admin/add-highlight/${id}`);
    };
    return (_jsxs("div", { className: "container py-4", children: [_jsx("h1", { className: "mb-4 text-center", children: "Admin Dashboard" }), _jsx("div", { className: "d-none d-sm-block", children: _jsx("div", { className: "table-responsive", children: _jsxs("table", { className: "table table-bordered table-striped table-hover align-middle text-center", children: [_jsx("thead", { className: "thead-dark", children: _jsxs("tr", { children: [_jsx("th", { children: "Name" }), _jsx("th", { children: "Position" }), _jsx("th", { children: "GP" }), _jsx("th", { children: "Stats" }), _jsx("th", { children: "Actions" })] }) }), _jsx("tbody", { children: players.map((player) => {
                                    const isEditing = editingId === player._id;
                                    return (_jsxs("tr", { children: [_jsx("td", { className: "text-break", children: isEditing ? (_jsxs(_Fragment, { children: [_jsx("input", { className: `form-control ${errors.name ? "is-invalid" : ""}`, value: formData.name ?? "", onChange: (e) => setFormData({ ...formData, name: e.target.value }) }), errors.name && (_jsx("div", { className: "invalid-feedback", children: errors.name }))] })) : (player.name) }), _jsx("td", { children: player.position }), _jsx("td", { children: isEditing ? (_jsxs(_Fragment, { children: [_jsx("input", { type: "number", className: `form-control ${errors.gamesPlayed ? "is-invalid" : ""}`, value: formData.gamesPlayed ?? "", onChange: (e) => setFormData({
                                                                ...formData,
                                                                gamesPlayed: e.target.value === ""
                                                                    ? undefined
                                                                    : +e.target.value,
                                                            }) }), errors.gamesPlayed && (_jsx("div", { className: "invalid-feedback", children: errors.gamesPlayed }))] })) : (player.gamesPlayed) }), _jsx("td", { className: "text-break", children: player.position === "Skater" ? (isEditing ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "mb-2", children: [_jsx("label", { className: "form-label", children: "G" }), _jsx("input", { type: "number", className: `form-control ${errors.goals ? "is-invalid" : ""}`, value: formData.goals ?? "", onChange: (e) => setFormData({
                                                                        ...formData,
                                                                        goals: e.target.value === ""
                                                                            ? undefined
                                                                            : +e.target.value,
                                                                    }) }), errors.goals && (_jsx("div", { className: "invalid-feedback", children: errors.goals }))] }), _jsxs("div", { className: "mb-2", children: [_jsx("label", { className: "form-label", children: "A" }), _jsx("input", { type: "number", className: `form-control ${errors.assists ? "is-invalid" : ""}`, value: formData.assists ?? "", onChange: (e) => setFormData({
                                                                        ...formData,
                                                                        assists: e.target.value === ""
                                                                            ? undefined
                                                                            : +e.target.value,
                                                                    }) }), errors.assists && (_jsx("div", { className: "invalid-feedback", children: errors.assists }))] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "P" }), _jsx("input", { className: "form-control", value: (formData.goals ?? 0) +
                                                                        (formData.assists ?? 0), disabled: true })] })] })) : (_jsxs(_Fragment, { children: ["G: ", player.goals, " | A: ", player.assists, " | P:", " ", player.points] }))) : isEditing ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "mb-2", children: [_jsx("label", { className: "form-label", children: "W" }), _jsx("input", { type: "number", className: `form-control ${errors.wins ? "is-invalid" : ""}`, value: formData.wins ?? "", onChange: (e) => setFormData({
                                                                        ...formData,
                                                                        wins: e.target.value === ""
                                                                            ? undefined
                                                                            : +e.target.value,
                                                                    }) }), errors.wins && (_jsx("div", { className: "invalid-feedback", children: errors.wins }))] }), _jsxs("div", { className: "mb-2", children: [_jsx("label", { className: "form-label", children: "GAA" }), _jsx("input", { type: "number", className: `form-control ${errors.goalsAgainstAverage ? "is-invalid" : ""}`, step: "0.01", value: formData.goalsAgainstAverage ?? "", onChange: (e) => setFormData({
                                                                        ...formData,
                                                                        goalsAgainstAverage: e.target.value === ""
                                                                            ? undefined
                                                                            : +e.target.value,
                                                                    }) }), errors.goalsAgainstAverage && (_jsx("div", { className: "invalid-feedback", children: errors.goalsAgainstAverage }))] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "SO" }), _jsx("input", { type: "number", className: `form-control ${errors.shutouts ? "is-invalid" : ""}`, value: formData.shutouts ?? "", onChange: (e) => setFormData({
                                                                        ...formData,
                                                                        shutouts: e.target.value === ""
                                                                            ? undefined
                                                                            : +e.target.value,
                                                                    }) }), errors.shutouts && (_jsx("div", { className: "invalid-feedback", children: errors.shutouts }))] })] })) : (_jsxs(_Fragment, { children: ["W: ", player.wins, " | GAA:", " ", player.goalsAgainstAverage?.toFixed(2), " | SO:", " ", player.shutouts] })) }), _jsx("td", { children: isEditing ? (_jsxs("div", { className: "d-grid gap-2", children: [_jsx("button", { className: "btn btn-success btn-sm", onClick: () => handleSave(player._id), children: "Save" }), _jsx("button", { className: "btn btn-secondary btn-sm", onClick: () => {
                                                                setEditingId(null);
                                                                setFormData({});
                                                                setErrors({});
                                                            }, children: "Cancel" })] })) : (_jsxs("div", { className: "d-grid gap-2", children: [_jsx("button", { className: "btn btn-primary btn-sm", onClick: () => handleEdit(player), children: "Edit" }), _jsx("button", { className: "btn btn-danger btn-sm", onClick: () => handleDelete(player._id), children: "Remove" }), _jsx("button", { className: "btn btn-info btn-sm", onClick: () => handleAddHighlight(player._id), children: "Add Highlight" })] })) })] }, player._id));
                                }) })] }) }) }), _jsx("div", { className: "d-block d-sm-none", children: players.map((player) => {
                    const isEditing = editingId === player._id;
                    return (_jsxs("div", { className: "card mb-4 shadow rounded border-dark border-2", children: [_jsx("h5", { className: "card-header bg-warning text-black", children: isEditing ? (_jsx("input", { className: `form-control ${errors.name ? "is-invalid" : ""}`, value: formData.name ?? "", onChange: (e) => setFormData({ ...formData, name: e.target.value }) })) : (player.name) }), _jsxs("div", { className: "card-body bg-light rounded-bottom", children: [_jsxs("h6", { className: "card-subtitle mb-2 text-muted", children: ["Position: ", player.position] }), _jsxs("p", { className: "card-text mb-2", children: ["Games Played: ", player.gamesPlayed] }), _jsx("div", { className: "mb-3", children: player.position === "Skater" ? (isEditing ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "mb-2", children: [_jsx("label", { className: "form-label", children: "Goals (G)" }), _jsx("input", { type: "number", className: `form-control ${errors.goals ? "is-invalid" : ""}`, value: formData.goals ?? "", onChange: (e) => setFormData({
                                                                ...formData,
                                                                goals: e.target.value === ""
                                                                    ? undefined
                                                                    : +e.target.value,
                                                            }) }), errors.goals && (_jsx("div", { className: "invalid-feedback", children: errors.goals }))] }), _jsxs("div", { className: "mb-2", children: [_jsx("label", { className: "form-label", children: "Assists (A)" }), _jsx("input", { type: "number", className: `form-control ${errors.assists ? "is-invalid" : ""}`, value: formData.assists ?? "", onChange: (e) => setFormData({
                                                                ...formData,
                                                                assists: e.target.value === ""
                                                                    ? undefined
                                                                    : +e.target.value,
                                                            }) }), errors.assists && (_jsx("div", { className: "invalid-feedback", children: errors.assists }))] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "Points (P)" }), _jsx("input", { className: "form-control", value: (formData.goals ?? 0) + (formData.assists ?? 0), disabled: true })] })] })) : (_jsxs("p", { className: "card-text", children: ["G: ", player.goals, " | A: ", player.assists, " | P:", " ", player.points] }))) : isEditing ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "mb-2", children: [_jsx("label", { className: "form-label", children: "Wins (W)" }), _jsx("input", { type: "number", className: `form-control ${errors.wins ? "is-invalid" : ""}`, value: formData.wins ?? "", onChange: (e) => setFormData({
                                                                ...formData,
                                                                wins: e.target.value === ""
                                                                    ? undefined
                                                                    : +e.target.value,
                                                            }) }), errors.wins && (_jsx("div", { className: "invalid-feedback", children: errors.wins }))] }), _jsxs("div", { className: "mb-2", children: [_jsx("label", { className: "form-label", children: "Goals Against Avg (GAA)" }), _jsx("input", { type: "number", step: "0.01", className: `form-control ${errors.goalsAgainstAverage ? "is-invalid" : ""}`, value: formData.goalsAgainstAverage ?? "", onChange: (e) => setFormData({
                                                                ...formData,
                                                                goalsAgainstAverage: e.target.value === ""
                                                                    ? undefined
                                                                    : +e.target.value,
                                                            }) }), errors.goalsAgainstAverage && (_jsx("div", { className: "invalid-feedback", children: errors.goalsAgainstAverage }))] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "Shutouts (SO)" }), _jsx("input", { type: "number", className: `form-control ${errors.shutouts ? "is-invalid" : ""}`, value: formData.shutouts ?? "", onChange: (e) => setFormData({
                                                                ...formData,
                                                                shutouts: e.target.value === ""
                                                                    ? undefined
                                                                    : +e.target.value,
                                                            }) }), errors.shutouts && (_jsx("div", { className: "invalid-feedback", children: errors.shutouts }))] })] })) : (_jsxs("p", { className: "card-text", children: ["W: ", player.wins, " | GAA:", " ", player.goalsAgainstAverage?.toFixed(2), " | SO:", " ", player.shutouts] })) }), _jsx("div", { className: "d-flex justify-content-between", children: isEditing ? (_jsxs(_Fragment, { children: [_jsx("button", { className: "btn btn-success btn-sm", onClick: () => handleSave(player._id), children: "Save" }), _jsx("button", { className: "btn btn-secondary btn-sm", onClick: () => {
                                                        setEditingId(null);
                                                        setFormData({});
                                                        setErrors({});
                                                    }, children: "Cancel" })] })) : (_jsxs(_Fragment, { children: [_jsx("button", { className: "btn btn-primary w-30", onClick: () => handleEdit(player), children: "Edit" }), _jsx("button", { className: "btn btn-danger w-30", onClick: () => handleDelete(player._id), children: "Remove" }), _jsx("button", { className: "btn btn-secondary w-30", onClick: () => handleAddHighlight(player._id), children: "Add Highlight" })] })) })] })] }, player._id));
                }) }), _jsxs("div", { id: "buttons", children: [_jsx("button", { className: "btn btn-secondary", onClick: () => navigate("/admin/new-player"), children: "Add New Player" }), _jsx("button", { className: "btn btn-warning ms-2", onClick: () => navigate("/admin/edit-highlights"), children: "Manage Highlights" })] })] }));
};
export default AdminDashboard;
