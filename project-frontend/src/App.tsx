import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import RosterPage from './pages/RosterPage';
import PlayerDetailPage from './pages/PlayerDetailPage';

const App: React.FC = () => {
  return (
    <>
      <Header />
      
      <main>
        <Routes>
          {/* Landing Page */}
          <Route path="*" element={<LandingPage />} />

          {/* List of Players */}
          <Route path="/roster" element={<RosterPage />} />

          {/* Player Details Page */}
          <Route path="/players/:id" element={<PlayerDetailPage />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
};

export default App;
