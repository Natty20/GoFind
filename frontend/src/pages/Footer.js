// HomePage.js
import React from 'react';
import '../styles/All/Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Liens de navigation du footer */}
        <div className="footer-links">
          <Link to={'/about'}>À propos</Link>
          <Link to={'/prestation'}>Prestations</Link>
          <Link to={'/faq'}>FAQ</Link>
          <Link to={'/'}>Contact</Link>
          <Link to={'/mentions-legales'}>Mentions légales</Link>
        </div>

        {/* Informations de contact */}
        <div className="footer-contact">
          <p>Téléphone : +33 1 23 45 67 89</p>
          <p>Email : giginatty20@gmail.com</p>
        </div>

        {/* Réseaux sociaux */}
        <div className="footer-social">
          <a href="#facebook" className="social-icon">
            FB
          </a>
          <a href="#twitter" className="social-icon">
            TW
          </a>
          <a href="#instagram" className="social-icon">
            IG
          </a>
          <a href="#linkedin" className="social-icon">
            LN
          </a>
        </div>

        {/* Copyright */}
        <div className="footer-copyright">
          <p>&copy; 2025 GoFind. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
