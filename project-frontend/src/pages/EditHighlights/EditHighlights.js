import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/EditHighlights/EditHighlightsPage.tsx
import { useEffect, useState } from "react";
import axios from "../../api";
import { validateHighlightEditForm } from "../../utils/validateForm";
const EditHighlightsPage = () => {
    const [highlights, setHighlights] = useState([]);
    const [editingHighlightId, setEditingHighlightId] = useState(null);
    const [editData, setEditData] = useState({ youtubeUrl: "", gameDate: "", description: "" });
    const [editErrors, setEditErrors] = useState({});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchHighlights = async () => {
            try {
                const res = await axios.get("/api/videos");
                setHighlights(res.data);
            }
            catch (err) {
                console.error("Failed to load highlights", err);
                setHighlights([]);
            }
            finally {
                setLoading(false);
            }
        };
        fetchHighlights();
    }, []);
    const handleEditClick = (h) => {
        setEditingHighlightId(h.highlightId);
        setEditData({
            youtubeUrl: h.youtubeUrl,
            gameDate: h.gameDate.slice(0, 10),
            description: h.description,
        });
        setEditErrors({});
    };
    const handleCancelEdit = () => {
        setEditingHighlightId(null);
        setEditData({ youtubeUrl: "", gameDate: "", description: "" });
        setEditErrors({});
    };
    const handleSaveEdit = async (h) => {
        const errors = validateHighlightEditForm(editData);
        if (Object.keys(errors).length > 0) {
            setEditErrors(errors);
            return;
        }
        try {
            const payload = {
                youtubeUrl: editData.youtubeUrl,
                description: editData.description,
                gameDate: editData.gameDate,
            };
            const response = await axios.put(`/api/videos/${h.playerId}/highlight/${h.highlightId}`, payload);
            if (response.data.message === "Highlight updated successfully") {
                setHighlights((prev) => prev.map((hl) => hl.highlightId === h.highlightId
                    ? { ...hl, ...payload }
                    : hl));
                handleCancelEdit();
            }
            else {
                console.error("Unexpected response:", response.data);
            }
        }
        catch (err) {
            console.error("Failed to save highlight", err);
        }
    };
    const handleDelete = async (h) => {
        if (!window.confirm("Are you sure you want to delete this highlight?"))
            return;
        try {
            await axios.delete(`/api/videos/${h.playerId}/highlight/${h.highlightId}`);
            setHighlights((prev) => prev.filter((hl) => hl.highlightId !== h.highlightId));
        }
        catch (err) {
            console.error("Failed to delete highlight", err);
        }
    };
    if (loading) {
        return _jsx("p", { className: "text-center my-5 text-primary", children: "Loading highlights..." });
    }
    if (!highlights.length) {
        return _jsx("p", { className: "text-center my-5 text-muted fst-italic", children: "No highlights available." });
    }
    return (_jsxs("div", { className: "container my-5", children: [_jsx("h2", { className: "fw-bold text-primary mb-4", children: "Edit Highlight Videos" }), _jsx("div", { className: "row g-4", children: highlights.map((h) => {
                    // build embed URL
                    const embedUrl = h.youtubeUrl.includes("watch?v=")
                        ? h.youtubeUrl.replace("watch?v=", "embed/")
                        : h.youtubeUrl.replace("youtu.be/", "youtube.com/embed/");
                    return (_jsx("div", { className: "col-md-6 col-lg-4", children: _jsx("div", { className: "card h-100 border-0 shadow rounded", children: editingHighlightId === h.highlightId ? (_jsxs("div", { className: "card-body", children: [_jsxs("div", { className: "mb-2", children: [_jsx("label", { className: "form-label small text-muted", children: "YouTube URL" }), _jsx("input", { type: "url", className: `form-control ${editErrors.youtubeUrl ? "is-invalid" : ""}`, value: editData.youtubeUrl, onChange: (e) => setEditData({ ...editData, youtubeUrl: e.target.value }) }), editErrors.youtubeUrl && (_jsx("div", { className: "invalid-feedback", children: editErrors.youtubeUrl }))] }), _jsxs("div", { className: "mb-2", children: [_jsx("label", { className: "form-label small text-muted", children: "Game Date" }), _jsx("input", { type: "date", className: `form-control ${editErrors.gameDate ? "is-invalid" : ""}`, value: editData.gameDate, onChange: (e) => setEditData({ ...editData, gameDate: e.target.value }) }), editErrors.gameDate && (_jsx("div", { className: "invalid-feedback", children: editErrors.gameDate }))] }), _jsxs("div", { className: "mb-2", children: [_jsx("label", { className: "form-label small text-muted", children: "Description" }), _jsx("input", { type: "text", className: `form-control ${editErrors.description ? "is-invalid" : ""}`, value: editData.description, onChange: (e) => setEditData({ ...editData, description: e.target.value }) }), editErrors.description && (_jsx("div", { className: "invalid-feedback", children: editErrors.description }))] }), _jsxs("div", { className: "d-flex justify-content-between mt-3", children: [_jsx("button", { className: "btn btn-success btn-sm", onClick: () => handleSaveEdit(h), children: "Save" }), _jsx("button", { className: "btn btn-secondary btn-sm", onClick: handleCancelEdit, children: "Cancel" })] })] })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "ratio ratio-16x9", children: _jsx("iframe", { className: "rounded-top", src: embedUrl, title: "Highlight Video", allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", allowFullScreen: true }) }), _jsxs("div", { className: "card-body bg-white", children: [_jsx("h5", { className: "card-title text-dark", children: h.playerName }), _jsxs("p", { className: "card-text text-dark mb-1", children: [_jsx("strong", { children: "Game Date:" }), " ", h.gameDate.slice(0, 10)] }), _jsxs("p", { className: "card-text text-muted", children: [_jsx("strong", { children: "Description:" }), " ", h.description] }), _jsxs("div", { className: "d-flex justify-content-between", children: [_jsx("button", { className: "btn btn-primary btn-sm", onClick: () => handleEditClick(h), children: "Edit" }), _jsx("button", { className: "btn btn-danger btn-sm", onClick: () => handleDelete(h), children: "Delete" })] })] })] })) }) }, h.highlightId));
                }) })] }));
};
export default EditHighlightsPage;
