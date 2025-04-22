// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import LandingPage from './pages/LandingPage/LandingPage';
import RosterPage from './pages/Roster/RosterPage';
import PlayerDetailPage from './pages/PlayerDetail/PlayerDetailPage';
import 'bootstrap/dist/css/bootstrap.min.css';


// Entry point with routing setup
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<App />}>
          <Route index element={<LandingPage />} />
          <Route path="roster" element={<RosterPage />} />
          <Route path="player/:id" element={<PlayerDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
