import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api';
// import './PlayerDetailPage.css';

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

  if (loading) return <div>Loading player details...</div>;
  if (!player) return <div>Player not found.</div>;

  return (
    <div className="player-detail-container">
      <h2>{player.name}</h2>
      <h4>Position: {player.position}</h4>

      <div className="stats">
        <h3>Stats</h3>
        <ul>
          <li>Games Played: {player.gamesPlayed}</li>
          {player.position === 'Skater' && (
            <>
              <li>Goals: {player.goals}</li>
              <li>Assists: {player.assists}</li>
              <li>Points: {player.points}</li>
            </>
          )}
          {player.position === 'Goalie' && (
            <>
              <li>Wins: {player.wins}</li>
              <li>GAA: {player.goalsAgainstAverage}</li>
            </>
          )}
        </ul>
      </div>

      <div className="highlights">
        <h3>Highlight Videos</h3>
        {player.highlightVideos.length > 0 ? (
          player.highlightVideos.map((video) => (
            <div key={video._id} className="highlight-card">
              <video width="480" controls>
                <source src={`/api/videos/${video.filename}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <p><strong>Description:</strong> {video.description}</p>
              <p><strong>Date:</strong> {new Date(video.gameDate).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>No highlight videos available for this player.</p>
        )}
      </div>
    </div>
  );
};

export default PlayerDetailPage;
