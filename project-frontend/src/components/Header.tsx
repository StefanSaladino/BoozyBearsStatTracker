import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LogoutButton from './LogoutButton';
import '../App.css';

const Header: React.FC = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="bg-dark text-white py-3 shadow">
      <div className="container d-flex justify-content-between align-items-center">
        <h1 className="h3 m-0">🐻 Boozy Bears Hockey</h1>
        <nav>
          <ul className="nav">
            <li className="nav-item">
              <Link to="/" className="nav-link text-white">🏠 Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/roster" className="nav-link text-white">🏒 Players</Link>
            </li>
            <li className="nav-item">
              <Link to="/admin-dashboard" className="nav-link text-white">Admin</Link>
            </li>
            <li className="nav-item">
              {isAuthenticated ? (
                <LogoutButton />
              ) : (
                <Link to="/login" className="btn btn-outline-light ms-2">
                  🔐 Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
        <div className="ms-3">
          <span className="badge bg-secondary">
            {isAuthenticated ? '✅ LOGGED IN' : '❌ NOT LOGGED IN'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
