// src/pages/EditHighlights/EditHighlightsPage.tsx

import React, { useEffect, useState, useContext } from "react";
import axios from "../../api";
import { validateHighlightEditForm } from "../../utils/validateForm";
import { AuthContext } from "../../context/AuthContext"; // Import the AuthContext
import { Navigate } from "react-router-dom";

interface Highlight {
  playerId: string;
  playerName: string;
  highlightId: string;
  youtubeUrl: string;
  gameDate: string;
  description: string;
}

const EditHighlightsPage: React.FC = () => {
  const { isAuthenticated, loading } = useContext(AuthContext); // Use AuthContext to check authentication status
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [editingHighlightId, setEditingHighlightId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{
    youtubeUrl: string;
    gameDate: string;
    description: string;
  }>({ youtubeUrl: "", gameDate: "", description: "" });
  const [editErrors, setEditErrors] = useState<{ [key: string]: string }>({});
  const [loadingHighlights, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchHighlights = async () => {
        try {
          const res = await axios.get<Highlight[]>("/api/videos");
          setHighlights(res.data);
        } catch (err) {
          console.error("Failed to load highlights", err);
          setHighlights([]);
        } finally {
          setLoading(false);
        }
      };

      fetchHighlights();
    }
  }, [isAuthenticated]); // Re-fetch when authentication status changes

  if (loading) {
    return <p className="text-center my-5 text-primary">Loading highlights...</p>;
  }

  if (loadingHighlights) {
    return <p className="text-center my-5 text-primary">Loading highlights...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />; // Redirect if not authenticated
  }

  const handleEditClick = (h: Highlight) => {
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

  const handleSaveEdit = async (h: Highlight) => {
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
      const response = await axios.put(
        `/api/videos/${h.playerId}/highlight/${h.highlightId}`,
        payload
      );
      if (response.data.message === "Highlight updated successfully") {
        setHighlights((prev) =>
          prev.map((hl) =>
            hl.highlightId === h.highlightId
              ? { ...hl, ...payload }
              : hl
          )
        );
        handleCancelEdit();
      } else {
        console.error("Unexpected response:", response.data);
      }
    } catch (err) {
      console.error("Failed to save highlight", err);
    }
  };

  const handleDelete = async (h: Highlight) => {
    if (!window.confirm("Are you sure you want to delete this highlight?"))
      return;
    try {
      await axios.delete(
        `/api/videos/${h.playerId}/highlight/${h.highlightId}`
      );
      setHighlights((prev) =>
        prev.filter((hl) => hl.highlightId !== h.highlightId)
      );
    } catch (err) {
      console.error("Failed to delete highlight", err);
    }
  };

  if (!highlights.length) {
    return <p className="text-center my-5 text-muted fst-italic">No highlights available.</p>;
  }

  return (
    <div className="container my-5">
      <h2 className="fw-bold text-primary mb-4">Edit Highlight Videos</h2>

      <div className="row g-4">
        {highlights.map((h) => {
          // build embed URL
          const embedUrl = h.youtubeUrl.includes("watch?v=")
            ? h.youtubeUrl.replace("watch?v=", "embed/")
            : h.youtubeUrl.replace("youtu.be/", "youtube.com/embed/");

          return (
            <div className="col-md-6 col-lg-4" key={h.highlightId}>
              <div className="card h-100 border-0 shadow rounded">
                {editingHighlightId === h.highlightId ? (
                  <div className="card-body">
                    {/* YouTube URL */}
                    <div className="mb-2">
                      <label className="form-label small text-muted">YouTube URL</label>
                      <input
                        type="url"
                        className={`form-control ${editErrors.youtubeUrl ? "is-invalid" : ""}`}
                        value={editData.youtubeUrl}
                        onChange={(e) =>
                          setEditData({ ...editData, youtubeUrl: e.target.value })
                        }
                      />
                      {editErrors.youtubeUrl && (
                        <div className="invalid-feedback">{editErrors.youtubeUrl}</div>
                      )}
                    </div>

                    {/* Game Date */}
                    <div className="mb-2">
                      <label className="form-label small text-muted">Game Date</label>
                      <input
                        type="date"
                        className={`form-control ${editErrors.gameDate ? "is-invalid" : ""}`}
                        value={editData.gameDate}
                        onChange={(e) =>
                          setEditData({ ...editData, gameDate: e.target.value })
                        }
                      />
                      {editErrors.gameDate && (
                        <div className="invalid-feedback">{editErrors.gameDate}</div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="mb-2">
                      <label className="form-label small text-muted">Description</label>
                      <input
                        type="text"
                        className={`form-control ${editErrors.description ? "is-invalid" : ""}`}
                        value={editData.description}
                        onChange={(e) =>
                          setEditData({ ...editData, description: e.target.value })
                        }
                      />
                      {editErrors.description && (
                        <div className="invalid-feedback">{editErrors.description}</div>
                      )}
                    </div>

                    {/* Save/Cancel */}
                    <div className="d-flex justify-content-between mt-3">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleSaveEdit(h)}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Embedded YouTube */}
                    <div className="ratio ratio-16x9">
                      <iframe
                        className="rounded-top"
                        src={embedUrl}
                        title="Highlight Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="card-body bg-white">
                      <h5 className="card-title text-dark">{h.playerName}</h5>
                      <p className="card-text text-dark mb-1">
                        <strong>Game Date:</strong> {h.gameDate.slice(0, 10)}
                      </p>
                      <p className="card-text text-muted">
                        <strong>Description:</strong> {h.description}
                      </p>
                      <div className="d-flex justify-content-between">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleEditClick(h)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(h)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EditHighlightsPage;
