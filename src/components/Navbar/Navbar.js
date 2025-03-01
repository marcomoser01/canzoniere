import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">Canzoniere</div>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">Home</Link>
          </li>
          <li className="navbar-item">
            <Link to="/indice-canzoni" className="navbar-link">Indice Canzoni</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 