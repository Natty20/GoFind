import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { MDBBtn, MDBContainer, MDBInput } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import '../styles/All/Login.css';

function PrestaLogin() {
  const navigate = useNavigate();
  const { setPrestataire } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        'https://gofind-v9ee.onrender.com/api/prestataires/login',
        { email, password }
      );

      const { token, prestataire } = response.data;

      if (!token || !prestataire) {
        throw new Error('Réponse invalide');
      }

      sessionStorage.setItem('token', token);
      sessionStorage.setItem('prestataire', JSON.stringify(prestataire));
      sessionStorage.setItem('role', 'prestataire');
      sessionStorage.setItem('prestataireId', prestataire._id);

      setPrestataire(prestataire);

      // ✅ REDIRECTION CORRECTE
      navigate(`/reservations`);
    } catch (error) {
      console.error(error);
      setError('Email ou mot de passe incorrect.');
    }
  };

  return (
    <main className="login-page">
      <div className="login-left-panel">
        <div className="welcome-text">
          <img
            src={`${process.env.PUBLIC_URL}/images/GF-logo.png`}
            alt="GoFind - Plateforme de mise en relation entre clients et prestataires"
          />
          <h1 className="tittles">GoFind ton plaisir près de chez toi</h1>
          <p>Veuillez vous connecter à votre compte</p>
        </div>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <form onSubmit={handleLogin} className="login-input-container">
          <p className="label">Email :</p>
          <MDBInput
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <p className="label">Mot de passe :</p>
          <MDBInput
            id="mdp"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <a className="text-muted" href="#!">
            Mot de passe oublié?
          </a>

          <button type="submit" className="btn-secondary">
            Se Connecter
          </button>
        </form>

        <div className="sans-compte">
          <p>Vous n’avez pas de compte?</p>
          <button
            className="btn-primary"
            color="danger"
            onClick={() => navigate('/prestataire_register')}
          >
            S&#39;inscrire
          </button>
        </div>
      </div>

      <div className="login-right-panel">
        <div>
          <h2>Nous sommes plus qu’une simple entreprise</h2>
          <p>
            Nous construisons des relations durables basées sur la confiance,
            l’innovation et l’humain. Notre mission va bien au-delà d’un simple
            service : nous créons de la valeur pour chaque personne que nous
            accompagnons.
          </p>
        </div>
      </div>
    </main>
  );
}

export default PrestaLogin;
