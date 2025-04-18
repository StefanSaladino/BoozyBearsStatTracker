// src/pages/LandingPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Landing page with CTA button to enter the app
const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate('/roster');
  };

  return (
    <section style={{ textAlign: 'center' }}>
      <h1>Welcome to Boozy Bears Hockey</h1>
      <button onClick={handleEnter} style={{ marginTop: '2rem', padding: '1rem 2rem' }}>
        Experience Boozy Bears Hockey
      </button>
    </section>
  );
};

export default LandingPage;
