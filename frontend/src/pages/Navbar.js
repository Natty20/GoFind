import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Users } from 'lucide-react';
import axios from 'axios';
import '../styles/All/Navbar.css';

const Navbar = () => {
  const { client, prestataire, admin, setClient, setPrestataire, setAdmin } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // === Recherche ===
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('client');
    sessionStorage.removeItem('prestataire');
    sessionStorage.removeItem('admin');
    setClient(null);
    setPrestataire(null);
    setAdmin(null);
    navigate('/');
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  let user = null;
  let role = '';
  if (client) {
    user = client;
    role = 'client';
  } else if (prestataire) {
    user = prestataire;
    role = 'prestataire';
  } else if (admin) {
    user = admin;
    role = 'admin';
  }

  return (
    <div className="navpage">
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <div className="navbar-logo">
            <Link to="/" onClick={closeMenu}>
              <img
                src={`${process.env.PUBLIC_URL}/images/GF-logo.png`}
                alt="GoFind"
              />
            </Link>
          </div>

          {/* Hamburger */}
          <div
            className={`hamburger ${menuOpen ? 'active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          {/* Navbar gauche */}
          <div className="navbar-left">
            {role === 'prestataire' && (
              <>
                <Link to="/reservations" onClick={closeMenu}>
                  Réservations
                </Link>
              </>
            )}
            {role === 'admin' && (
              <Link to="/dashboard" onClick={closeMenu}>
                Tableau de Bord
              </Link>
            )}
          </div>
          {/* Navbar droite */}
          <div className="navbar-right">
            {role !== 'admin' && (
              <Link to="/prestation" onClick={closeMenu}>
                Prestations
              </Link>
            )}

            {user ? (
              <div className="dropdown">
                <button
                  className="dropbtn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <Users size={20} /> {user.nom}
                </button>
                {dropdownOpen && (
                  <div className="dropdown-content">
                    <Link to="/mon-profil" onClick={closeMenu}>
                      Mon Profil
                    </Link>
                    <button onClick={handleLogout}>Déconnexion</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/choix_compte">Compte</Link>
            )}
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="navbar-mobile-links">
              {role === 'prestataire' && (
                <>
                  <Link to="/reservations" onClick={closeMenu}>
                    Réservations
                  </Link>
                </>
              )}
              {role === 'admin' && (
                <Link to="/dashboard" onClick={closeMenu}>
                  Tableau de Bord
                </Link>
              )}
              {role !== 'admin' && (
                <Link to="/prestation" onClick={closeMenu}>
                  Prestations
                </Link>
              )}

              {user ? (
                <>
                  <Link to="/mon-profil" onClick={closeMenu}>
                    Mon Profil
                  </Link>
                  <button onClick={handleLogout}>Déconnexion</button>
                </>
              ) : (
                <Link to="/choix_compte" onClick={closeMenu}>
                  Compte
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
