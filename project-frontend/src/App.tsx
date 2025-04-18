import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import RosterPage from './pages/RosterPage';
import PlayerDetailPage from './pages/PlayerDetailPage';
import AdminDashboard from './pages/AdminDashboard';
import NewPlayerPage from './pages/NewPlayerPage';
import AddHighlightPage from './pages/AddHighlightPage';

const App: React.FC = () => {
  return (
    <>
      <Header />
      
      <main>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* List of Players */}
          <Route path="/roster" element={<RosterPage />} />

          {/* Player Details Page */}
          <Route path="/players/:id" element={<PlayerDetailPage />} />

          {/*Main admin dashboard */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/*Admin page to add new player */}
          <Route path="/admin/new-player" element={<NewPlayerPage />} />

          {/*Admin page to add highlight videos */}
          <Route path="/admin/add-highlight/:playerId" element={<AddHighlightPage />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
};

export default App;
