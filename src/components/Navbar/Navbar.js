import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Chiudi il menu se la finestra viene ridimensionata a dimensioni desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && menuOpen) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [menuOpen]);

  // Impedisci lo scroll del body quando il menu è aperto
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [menuOpen]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">Canzoniere</div>
        
        {/* Hamburger Icon */}
        <div className="hamburger-icon" onClick={toggleMenu} aria-label="Menu">
          <div className={`hamburger-line ${menuOpen ? 'open' : ''}`}></div>
          <div className={`hamburger-line ${menuOpen ? 'open' : ''}`}></div>
          <div className={`hamburger-line ${menuOpen ? 'open' : ''}`}></div>
        </div>

        {/* Overlay per il menu mobile */}
        {menuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
        
        {/* Menu di navigazione */}
        <ul className={`navbar-menu ${menuOpen ? 'menu-open' : ''}`}>
          <div className="mobile-menu-header">
            <div className="mobile-menu-title">Menu</div>
            <button className="close-menu-button" onClick={closeMenu} aria-label="Chiudi menu">×</button>
          </div>
          <li className="navbar-item">
            <Link to="/" className="navbar-link" onClick={closeMenu}>Home</Link>
          </li>
          <li className="navbar-item">
            <Link to="/indice-canzoni" className="navbar-link" onClick={closeMenu}>Indice Canzoni</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 