import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LogoutButton from './LogoutButton';
import '../App.css';

const Header: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="bg-dark text-white shadow sticky-top">
      <div className="container d-flex py-3 justify-content-between align-items-center">
        <h1 className="m-0">🐻 Boozy Bears Hockey</h1>

        {/* Hamburger button for tablet/mobile (991px and smaller) */}
        <button
          className="custom-toggler d-lg-none border-1 bg-transparent"
          type="button"
          aria-label="Toggle navigation"
          onClick={toggleMenu}
        >
          <div className="toggler-icon"></div>
          <div className="toggler-icon"></div>
          <div className="toggler-icon"></div>
        </button>

        {/* Normal nav for desktop (992px and larger) */}
        <nav className="d-none d-lg-block">
          <ul className="nav">
            <li className="nav-item">
              <Link to="/" className="nav-link text-white">
                🏠 Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/roster" className="nav-link text-white">
                🏒 Players
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin-dashboard" className="nav-link text-white">
                Admin
              </Link>
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

        {/* Right side badge */}
        <div className="ms-3 d-none d-lg-block" >
          <span className="badge bg-secondary">
            {isAuthenticated ? '✅ LOGGED IN' : '❌ NOT LOGGED IN'}
          </span>
        </div>
      </div>

      {/* Collapsible mobile/tablet menu (991px and smaller) */}
      {menuOpen && (
        <div className="bg-dark d-lg-none border-top border-bottom border-2 border-white">
          <ul className="nav flex-column text-center">
            <li className="nav-item">
              <Link to="/" className="nav-link text-white" onClick={closeMenu}>
                🏠 Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/roster" className="nav-link text-white" onClick={closeMenu}>
                🏒 Players
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin-dashboard" className="nav-link text-white" onClick={closeMenu}>
                Admin
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <span className="nav-link text-warning">✅ Logged In</span>
                </li>
                <li className="nav-item">
                  <LogoutButton />
                </li>
              </>
            ) : (
              <li className="nav-item" id="last-nav">
                <Link to="/login" className="nav-link text-white" onClick={closeMenu}>
                  🔐 Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
