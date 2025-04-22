// components/LogoutButton.tsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import { AuthContext } from '../context/AuthContext';

const LogoutButton: React.FC = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/logout');
      setIsAuthenticated(false);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: '0.4rem 0.8rem',
        background: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
