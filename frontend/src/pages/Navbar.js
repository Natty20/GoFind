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

  // Déterminer le rôle et l'utilisateur
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
            <Link to="/">
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

          {/* Desktop links */}
          <div className="navbar-left">
            {/* {role === 'client' && <Link to="/rendezvous">Mes Rendez-vous</Link>} */}
            {role === 'prestataire' && (
              <>
                <Link to="/reservations">Réservations</Link>
                {/* <Link to="/mes-prestations">Mes Prestations</Link> */}
              </>
            )}
            {role === 'admin' && <Link to="/dashboard">Tableau de Bord</Link>}
          </div>

          <div className="navbar-right">
            {role !== 'admin' && <Link to="/prestation">Prestations</Link>}

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
                    <Link to="/mon-profil">Mon Profil</Link>
                    <button onClick={handleLogout}>Déconnexion</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/choix_compte">Compte</Link>
            )}
          </div>

          {/* Mobile menu (tout rôle) */}
          {menuOpen && (
            <div className="navbar-mobile-links">
              {role === 'client' && (
                <Link to="/rendezvous">Mes Rendez-vous</Link>
              )}
              {role === 'prestataire' && (
                <>
                  <Link to="/reservations">Réservations</Link>
                  <Link to="/mes-prestations">Mes Prestations</Link>
                </>
              )}
              {role === 'admin' && <Link to="/dashboard">Tableau de Bord</Link>}

              {role !== 'admin' && <Link to="/prestation">Prestations</Link>}

              {user ? (
                <>
                  <Link to="/mon-profil">Mon Profil</Link>
                  <button onClick={handleLogout}>Déconnexion</button>
                </>
              ) : (
                <Link to="/choix_compte">Compte</Link>
              )}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
