import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api';

type Highlight = {
  _id: string;
  filename: string;
  uploadedAt: string;
  description: string;
  gameDate: string;
};

type Player = {
  _id: string;
  name: string;
  position: 'Skater' | 'Goalie';
  gamesPlayed: number;
  goals?: number;
  assists?: number;
  points?: number;
  wins?: number;
  goalsAgainstAverage?: number;
  highlightVideos: Highlight[];
};

const PlayerDetailPage: React.FC = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const response = await axios.get(`/players/${id}`);
        setPlayer(response.data);
      } catch (error) {
        console.error('❌ Error fetching player:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [id]);

  if (loading) return <div className="text-center mt-5 text-primary">Loading player details...</div>;
  if (!player) return <div className="text-center mt-5 text-danger">Player not found.</div>;

  return (
    <div className="container my-5">
      {/* Player Info */}
      <div className="mb-4">
        <h2 className="fw-bold text-dark">{player.name}</h2>
        <h5 className="text-info-emphasis">Position: {player.position}</h5>
      </div>

      {/* Stat Bar */}
      <div className="bg-light border rounded shadow-sm p-3 mb-5">
        <h4 className="mb-3 border-bottom pb-2 text-primary">Player Stats</h4>
        <div className="d-flex flex-wrap justify-content-between text-center">
          <StatItem label="Games Played" value={player.gamesPlayed} />

          {player.position === 'Skater' && (
            <>
              <StatItem label="Goals" value={player.goals} />
              <StatItem label="Assists" value={player.assists} />
              <StatItem label="Points" value={player.points} />
            </>
          )}

          {player.position === 'Goalie' && (
            <>
              <StatItem label="Wins" value={player.wins} />
              <StatItem label="GAA" value={player.goalsAgainstAverage} />
            </>
          )}
        </div>
      </div>

      {/* Highlight Videos */}
      <div>
        <h4 className="mb-4 text-primary">Highlight Videos</h4>
        {player.highlightVideos.length > 0 ? (
          <div className="row g-4">
            {player.highlightVideos.map((video) => (
              <div className="col-md-6 col-lg-4" key={video._id}>
                <div className="card h-100 border-0 shadow rounded">
                  <video className="card-img-top rounded-top" controls>
                    <source
                      src={`http://localhost:3000/api/videos/${video.filename}`}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                  <div className="card-body bg-white">
                    <p className="card-text mb-2 text-dark">
                      <strong>Description:</strong> {video.description}
                    </p>
                    <p className="card-text text-muted">
                      <strong>Date:</strong> {new Date(video.gameDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted fst-italic">No highlight videos available for this player.</p>
        )}
      </div>
    </div>
  );
};

// Reusable stat item component with colored labels and dividers
const StatItem: React.FC<{ label: string; value?: number }> = ({ label, value }) => (
  <div className="flex-grow-1 px-3 border-end last:border-end-0">
    <div className="text-uppercase fw-semibold text-info small">{label}</div>
    <div className="fs-5 fw-bold text-dark">{value ?? '—'}</div>
  </div>
);

export default PlayerDetailPage;
