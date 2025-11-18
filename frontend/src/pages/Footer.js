import React from 'react';
import '../styles/All/Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          <Link to="/apropos">À propos</Link>
          <Link to="/prestation">Prestations</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/mentions-legales">Mentions légales</Link>
        </div>

        <div className="footer-social">
          <a href="#" className="social-icon">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="social-icon">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="social-icon">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" className="social-icon">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>

        <div className="footer-copyright">
          <p>&copy; 2025 GoFind. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
