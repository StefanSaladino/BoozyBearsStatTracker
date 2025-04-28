import React, { useEffect, useState } from "react";
import axios from "../../api";
import { validateHighlightEditForm } from "../../utils/validateForm";

interface Highlight {
  playerId: string;
  playerName: string;
  filename: string;
  highlightId: string;
  gameDate: string;
  description: string;
}

const EditHighlightsPage: React.FC = () => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [editingHighlightId, setEditingHighlightId] = useState<string | null>(
    null
  );
  const [editData, setEditData] = useState<{
    gameDate: string;
    description: string;
  }>({ gameDate: "", description: "" });
  const [editErrors, setEditErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const res = await axios.get("/api/videos");
        if (Array.isArray(res.data)) {
          setHighlights(res.data);
        } else {
          console.warn("Highlights data not array");
          setHighlights([]);
        }
      } catch (err) {
        console.error("Failed to load highlights", err);
        setHighlights([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHighlights();
  }, []);

  const handleEditClick = (highlight: Highlight) => {
    setEditingHighlightId(highlight.highlightId);
    setEditData({
      gameDate: highlight.gameDate.slice(0, 10),
      description: highlight.description,
    });
    setEditErrors({});
  };

  const handleCancelEdit = () => {
    setEditingHighlightId(null);
    setEditData({ gameDate: "", description: "" });
    setEditErrors({});
  };

  const handleSaveEdit = async (highlight: Highlight) => {
    console.log("Save button clicked", editData);

    // Log the playerId and highlightId
    console.log("Player ID:", highlight.playerId);
    console.log("Highlight ID:", highlight.highlightId);

    const errors = validateHighlightEditForm(editData);
    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }

    try {
      const response = await axios.put(
        `/api/videos/${highlight.playerId}/highlight/${highlight.highlightId}`,
        {
          description: editData.description,
          gameDate: editData.gameDate, // Already in YYYY-MM-DD format
        }
      );

      if (
        response.data &&
        response.data.message === "Highlight updated successfully"
      ) {
        setHighlights((prev) =>
          prev.map((h) =>
            h.highlightId === highlight.highlightId
              ? {
                  ...h,
                  gameDate: editData.gameDate,
                  description: editData.description,
                }
              : h
          )
        );
        handleCancelEdit();
      } else {
        console.error("Unexpected response from backend:", response.data);
      }
    } catch (err) {
      console.error("Failed to save highlight", err);
    }
  };

  const handleDelete = async (highlight: Highlight) => {
    if (!window.confirm("Are you sure you want to delete this highlight?")) return;
    try {
      await axios.delete(
        `/api/videos/${highlight.playerId}/highlight/${highlight.highlightId}`
      );
      setHighlights((prev) =>
        prev.filter((h) => h.highlightId !== highlight.highlightId)
      );
    } catch (err) {
      console.error("Failed to delete highlight", err);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="fw-bold text-primary mb-4">Edit Highlight Videos</h2>

      {loading ? (
        <p className="text-center text-primary">Loading highlights...</p>
      ) : highlights.length === 0 ? (
        <p className="text-center text-muted fst-italic">
          No highlights available.
        </p>
      ) : (
        <div className="row g-4">
          {highlights.map((h) => (
            <div className="col-md-6 col-lg-4" key={h.highlightId}>
              <div className="card h-100 border-0 shadow rounded">
                <video className="card-img-top rounded-top" controls>
                  <source
                    src={`http://localhost:3000/api/videos/${h.filename}`}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
                <div className="card-body bg-white">
                  <h5 className="card-title text-dark">{h.playerName}</h5>

                  {editingHighlightId === h.highlightId ? (
                    <>
                      <div className="mb-2">
                        <label className="form-label fw-semibold small text-muted">
                          Game Date
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          value={editData.gameDate}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              gameDate: e.target.value,
                            })
                          }
                        />
                        {editErrors.gameDate && (
                          <div className="text-danger small">
                            {editErrors.gameDate}
                          </div>
                        )}
                      </div>

                      <div className="mb-2">
                        <label className="form-label fw-semibold small text-muted">
                          Description
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={editData.description}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              description: e.target.value,
                            })
                          }
                        />
                        {editErrors.description && (
                          <div className="text-danger small">
                            {editErrors.description}
                          </div>
                        )}
                      </div>

                      <div className="d-flex justify-content-between mt-3">
                        <button
                          type="button"
                          className="btn btn-success btn-sm"
                          onClick={(e) => {
                            e.preventDefault();
                            handleSaveEdit(h);
                          }}>
                          Save
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={handleCancelEdit}>
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="card-text text-dark mb-1">
                        <strong>Game Date:</strong> {h.gameDate.slice(0, 10)}
                      </p>
                      <p className="card-text text-muted mb-2">
                        <strong>Description:</strong> {h.description}
                      </p>
                      <div className="d-flex justify-content-between">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleEditClick(h)}>
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(h)}>
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditHighlightsPage;
