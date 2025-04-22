import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../LandingPage/LandingPage.css';
import mainLogo from '../../assets/main-logo-half.png'; // Adjust path if needed

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isGliding, setIsGliding] = useState(false);

  const handleEnter = () => {
    setIsGliding(true); // Start the glide animation

    // After the animation completes, navigate to the next page
    setTimeout(() => {
      navigate('/roster');
    }, 2000); // Delay the navigation to match the animation duration
  };

  return (
    <section className="landing-section">
      <div className="landing-image">
        <img src={mainLogo} alt="Boozy Bears Logo" />
      </div>
      <div className="landing-text">
        <h1 className="landing-title">Welcome to<br /> Boozy Bears Hockey</h1>
        <button
          className={`landing-button ${isGliding ? 'gliding' : ''}`}
          onClick={handleEnter}
        >
          ROSTER
        </button>
      </div>
    </section>
  );
};

export default LandingPage;
