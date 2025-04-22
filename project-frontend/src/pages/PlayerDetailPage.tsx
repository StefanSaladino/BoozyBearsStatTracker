import React, { useEffect, useState } from 'react'; // Import necessary hooks from React
import { useParams } from 'react-router-dom'; // Import useParams to extract the player ID from the URL
import axios from '../api'; // Import the axios instance for making API requests

// Type definitions for the Highlight and Player objects
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
  position: 'Skater' | 'Goalie'; // The player’s position: either Skater or Goalie
  gamesPlayed: number; // Number of games the player has played
  goals?: number; // Goals scored by the player (for Skaters)
  assists?: number; // Assists made by the player (for Skaters)
  points?: number; // Total points (Goals + Assists) for Skaters
  wins?: number; // Wins by the player (for Goalies)
  goalsAgainstAverage?: number; // Goals Against Average for Goalies
  highlightVideos: Highlight[]; // Array of highlight videos for the player
};

const PlayerDetailPage: React.FC = () => {
  // Extract player ID from the URL parameter
  const { id } = useParams();
  
  // State to hold player data, initialized as null
  const [player, setPlayer] = useState<Player | null>(null);
  
  // State to track if data is still loading
  const [loading, setLoading] = useState(true);

  // Fetch player data when the component mounts or when the player ID changes
  useEffect(() => {
    // Function to fetch player data from the backend API
    const fetchPlayer = async () => {
      try {
        // Send GET request to fetch player data
        const response = await axios.get(`/players/${id}`);
        // Set the player data received from the API response
        setPlayer(response.data);
      } catch (error) {
        // Log error if request fails
        console.error('❌ Error fetching player:', error);
      } finally {
        // Set loading state to false once the request is complete
        setLoading(false);
      }
    };

    // Call the fetchPlayer function to get player data
    fetchPlayer();
  }, [id]); // Dependency array to re-run this effect when the player ID changes

  // Show loading text while data is being fetched
  if (loading) return <div>Loading player details...</div>;

  // Show error message if player data is not found
  if (!player) return <div>Player not found.</div>;

  return (
    <div className="player-detail-container">
      {/* Display player’s name */}
      <h2>{player.name}</h2>
      
      {/* Display player’s position */}
      <h4>Position: {player.position}</h4>

      <div className="stats">
        {/* Display stats section */}
        <h3>Stats</h3>
        <ul>
          {/* Display games played */}
          <li>Games Played: {player.gamesPlayed}</li>
          
          {/* Conditionally render stats based on the player’s position */}
          {player.position === 'Skater' && (
            <>
              {/* Display goals for Skaters */}
              <li>Goals: {player.goals}</li>
              {/* Display assists for Skaters */}
              <li>Assists: {player.assists}</li>
              {/* Display total points for Skaters */}
              <li>Points: {player.points}</li>
            </>
          )}
          
          {player.position === 'Goalie' && (
            <>
              {/* Display wins for Goalies */}
              <li>Wins: {player.wins}</li>
              {/* Display Goals Against Average for Goalies */}
              <li>GAA: {player.goalsAgainstAverage}</li>
            </>
          )}
        </ul>
      </div>

      <div className="highlights">
        {/* Display highlight videos section */}
        <h3>Highlight Videos</h3>
        
        {/* Conditionally render highlight videos if available */}
        {player.highlightVideos.length > 0 ? (
          player.highlightVideos.map((video) => (
            <div key={video._id} className="highlight-card">
              <video width="480" controls>
                {/* Render the video with the correct filename */}
                <source src={`http://localhost:3000/api/videos/${video.filename}`} type="video/mp4" />
                {/* Fallback message if video tag is not supported */}
                Your browser does not support the video tag.
              </video>
              {/* Display the video description */}
              <p><strong>Description:</strong> {video.description}</p>
              {/* Display the game date in a readable format */}
              <p><strong>Date:</strong> {new Date(video.gameDate).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          // Display message if no highlight videos are available
          <p>No highlight videos available for this player.</p>
        )}
      </div>
    </div>
  );
};

export default PlayerDetailPage;
