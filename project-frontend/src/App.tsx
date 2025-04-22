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
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';


const App: React.FC = () => {
  return (
    <>
    <AuthProvider>
      <Header />
      
      <main>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Register Page */}
          <Route path="/register" element={<RegisterPage />} />

          {/* Login Page */}
          <Route path="/login" element={<LoginPage />} />

          {/* List of Players */}
          <Route path="/roster" element={<RosterPage />} />

          {/* Player Details Page */}
          <Route path="/players/:id" element={<PlayerDetailPage />} />

          {/*Main admin dashboard */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          {/*Admin page to add new player */}
          <Route path="/admin/new-player" element={<NewPlayerPage />} />

          {/*Admin page to add highlight videos */}
          <Route path="/admin/add-highlight/:playerId" element={<AddHighlightPage />} />

          
        </Routes>
      </main>

      <Footer />
      </AuthProvider>
    </>
  );
};

export default App;
