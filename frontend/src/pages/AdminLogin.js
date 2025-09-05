import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { MDBInput } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import '../styles/All/Login.css';

function AdminLogin() {
  const navigate = useNavigate();
  const { setAdmin } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        'https://gofind-v9ee.onrender.com/api/admin/login',
        { email, password }
      );
      const { token, admin } = response.data;

      sessionStorage.setItem('token', token);
      sessionStorage.setItem('admin', JSON.stringify(admin));
      setAdmin(admin);

      navigate('/dashboard');
    } catch (error) {
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
          <h1>GoFind ton plaisir près de chez toi</h1>
          <p>Veuillez vous connecter à votre compte</p>
        </div>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <form onSubmit={handleLogin} className="input-container">
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

          <button type="submit" className="login-btn">
            Se Connecter
          </button>
        </form>

        <div>
          <p>
            Vous n’avez pas de compte? Contactez-nous pour la création de votre
            compte!
          </p>
        </div>
      </div>

      <div className="right-panel">
        <div>
          <h4>We are more than just a company</h4>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>
    </main>
  );
}

export default AdminLogin;
