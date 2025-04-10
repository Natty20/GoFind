import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { MDBBtn, MDBContainer, MDBInput } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import '../styles/All/Login.css';

function LoginForm() {
  const navigate = useNavigate();
  const { setClient } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        'http://149.202.53.181:2000/api/auth/login',
        { email, password }
      );
      const { token, client } = response.data;

      sessionStorage.setItem('token', token);
      sessionStorage.setItem('clientId', client._id);
      sessionStorage.setItem('client', JSON.stringify(client));
      setClient(client); // ✅ Met à jour globalement le client

      navigate('/');
    } catch (error) {
      setError('Email ou mot de passe incorrect.');
    }
  };

  return (
    <MDBContainer className="gradient-form">
      <div className="left-panel">
        <div className="text-center">
          <img
            src="/images/GF-logo.png"
            style={{ width: '120px' }}
            alt="logo"
          />
          <h4>GoFind ton plaisir près de chez toi</h4>
        </div>
        <p>Veuillez vous connecter à votre compte</p>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <form onSubmit={handleLogin} className="input-container">
          <p className="inputlable">Email :</p>
          <MDBInput
            id="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <p className="inputlable">Mot de passe :</p>
          <MDBInput
            id="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <MDBBtn type="submit" className="signin">
            Se Connecter
          </MDBBtn>
        </form>

        <a className="text-muted" href="#!">
          Mot de passe oublié?
        </a>

        <div>
          <p>Vous n’avez pas de compte?</p>
          <MDBBtn
            outline
            className="gotoregidter"
            color="danger"
            onClick={() => navigate('/register')}
          >
            S&#39;inscrire
          </MDBBtn>
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

        <MDBBtn
          outline
          className="gotoregidter"
          color="danger"
          onClick={() => navigate('/login_admin')}
        >
          Admin login
        </MDBBtn>
      </div>
    </MDBContainer>
  );
}

export default LoginForm;
