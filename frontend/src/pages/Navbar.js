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

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('client');
    sessionStorage.removeItem('prestataire');
    sessionStorage.removeItem('admin');
    setClient(null);
    setPrestataire(null);
    setAdmin(null);
    navigate('/');
  };

  // Déterminer le rôle de l'utilisateur connecté
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
    <div className="homepage">
      <nav className="navbar">
        <div className="navbar-container">
          {/* left side */}
          <div className="navbar-logo">
            <Link to="/">
              <img
                src="/images/GF-logo.png"
                alt="GoFind - Plateforme de mise en relation entre clients et prestataires"
              />
            </Link>
          </div>

          {/* Section gauche : Menu selon le rôle */}
          <div className="navbar-left">
            {role === 'client' && (
              <>
                <Link to="/messages">Messages</Link>
                <Link to="/">Recherche</Link>
              </>
            )}

            {role === 'prestataire' && (
              <>
                <Link to="/demandes">Reservations</Link>
              </>
            )}

            {role === 'admin' && (
              <>
                <Link to="/dashboard">Tableau de Bord</Link>
              </>
            )}
          </div>

          {/* Section droite : Liens et Profil */}
          <div className="navbar-right">
            {role !== 'admin' && <Link to="/prestation">Prestations</Link>}
            {role !== 'admin' && <Link to="/about">à propos</Link>}

            {/* Si connecter */}
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
              /* sinon */
              <Link to="/login">Compte</Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
