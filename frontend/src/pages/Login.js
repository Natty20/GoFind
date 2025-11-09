import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { MDBBtn, MDBContainer, MDBInput } from 'mdb-react-ui-kit';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/All/Login.css';

function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setClient } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const from = location.state?.from || '/';
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        'https://gofind-v9ee.onrender.com/api/auth/login',
        { email, password }
      );
      const { token, client } = response.data;

      sessionStorage.setItem('token', token);
      sessionStorage.setItem('clientId', client._id);
      sessionStorage.setItem('client', JSON.stringify(client));
      setClient(client); // ✅ Met à jour globalement le client

      navigate(from, { replace: true });
    } catch (error) {
      setError('Email ou mot de passe incorrect.');
      console.error('Erreur de connexion :', err);
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
            id="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <p className="label">Mot de passe :</p>
          <MDBInput
            id="input"
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
            onClick={() => navigate('/register')}
          >
            S&#39;inscrire
          </button>
        </div>
      </div>

      <div className="login-right-panel">
        <h2>Nous sommes plus qu’une simple entreprise</h2>
        <p>
          Nous construisons des relations durables basées sur la confiance,
          l’innovation et l’humain. Notre mission va bien au-delà d’un simple
          service : nous créons de la valeur pour chaque personne que nous
          accompagnons.
        </p>
      </div>
    </main>
  );
}

export default LoginForm;
