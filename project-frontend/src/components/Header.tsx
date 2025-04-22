import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Assuming the context is set up like this

const Header: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext); // Accessing the authentication state from the context

  return (
    <header>
      <h1>Boozy Bears Hockey</h1>
      <nav>
        <ul>
          <li><Link to="/">🏠 Home</Link></li>
          <li><Link to="/roster">🏒 Players</Link></li>
        </ul>
      </nav>
      <div>
        {/* Show "LOGGED IN" or "NOT LOGGED IN" based on authentication state */}
        <span>{isAuthenticated ? 'LOGGED IN' : 'NOT LOGGED IN'}</span>
      </div>
    </header>
  );
};

export default Header;
