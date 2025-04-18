import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header>
      <h1>Boozy Bears Hockey</h1>
      <nav>
        <ul>
          <li><Link to="/">🏠 Home</Link></li>
          <li><Link to="/roster">🏒 Players</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
