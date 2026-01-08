import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Users } from 'lucide-react';
import '../styles/All/Navbar.css';

const Navbar = () => {
  const { client, prestataire, admin, setClient, setPrestataire, setAdmin } =
    useContext(AuthContext);

  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.clear();
    setClient(null);
    setPrestataire(null);
    setAdmin(null);
    navigate('/');
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

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

  const renderRoleLinks = () => (
    <>
      {role === 'prestataire' && (
        <Link to="/reservations" onClick={closeMenu}>
          Réservations
        </Link>
      )}

      {role === 'admin' && (
        <Link to="/dashboard" onClick={closeMenu}>
          Tableau de bord
        </Link>
      )}

      {role === 'client' && (
        <Link to="/rdv-client" onClick={closeMenu}>
          Mes rendez-vous
        </Link>
      )}
    </>
  );

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/" onClick={closeMenu}>
            <img src="/images/GF-logo.png" alt="GoFind" />
          </Link>
        </div>

        {/* Hamburger */}
        <div
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </div>

        {/* Desktop left */}
        <div className="navbar-left">{renderRoleLinks()}</div>

        {/* Desktop right */}
        <div className="navbar-right">
          {/* Prestations visible pour TOUS */}
          <Link to="/prestation" onClick={closeMenu}>
            Prestations
          </Link>

          {user ? (
            <div className="dropdown">
              <button
                className="dropbtn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <Users size={18} /> {user.nom}
              </button>

              {dropdownOpen && (
                <div className="dropdown-content show">
                  <Link to="/mon-profil" onClick={closeMenu}>
                    Mon profil
                  </Link>
                  <button onClick={handleLogout}>Déconnexion</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/choix_compte" onClick={closeMenu}>
              Compte
            </Link>
          )}
        </div>
      </div>

      {/* ✅ MOBILE MENU (toujours rendu) */}
      <div className={`navbar-mobile-links ${menuOpen ? 'active' : ''}`}>
        {renderRoleLinks()}

        <Link to="/prestation" onClick={closeMenu}>
          Prestations
        </Link>

        {user ? (
          <>
            <Link to="/mon-profil" onClick={closeMenu}>
              Mon profil
            </Link>
            <button onClick={handleLogout}>Déconnexion</button>
          </>
        ) : (
          <Link to="/choix_compte" onClick={closeMenu}>
            Compte
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
