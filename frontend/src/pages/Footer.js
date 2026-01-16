import React from 'react';
import '../styles/All/Footer.css';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <section className="footer-container">
        <div className="footer-links">
          <Link to="/apropos">À propos</Link>
          <Link to="/prestation">Prestations</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/mentions-legales">Mentions légales</Link>
        </div>

        <div className="footer-social">
          <a href="#" className="social-icon">
            <FaFacebookF />
          </a>
          <a href="#" className="social-icon">
            <FaTwitter />
          </a>
          <a href="#" className="social-icon">
            <FaInstagram />
          </a>
          <a href="#" className="social-icon">
            <FaLinkedinIn />
          </a>
        </div>

        <div className="footer-copyright">
          <p>&copy; 2025 GoFind. Tous droits réservés.</p>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
