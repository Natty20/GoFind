import React, { useState, useContext } from 'react';
import axios from 'axios';
import { MDBBtn, MDBContainer, MDBInput } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // 🔥 Utilisation du contexte pour l'auth
import '../styles/All/Register.css';

function Register() {
  const navigate = useNavigate();
  const { setClient } = useContext(AuthContext); // 🔥 Permet de stocker l'utilisateur après inscription

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    phone: '',
    profilePicture: '',
    address: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // ✅ Fonction pour gérer les changements dans les inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Fonction pour gérer l'inscription
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const response = await axios.post(
        'http://149.202.53.181:2000/api/auth/register',
        {
          nom: formData.nom,
          prenom: formData.prenom,
          phone: formData.phone,
          profilePicture: formData.profilePicture,
          address: formData.address,
          email: formData.email,
          password: formData.password,
        }
      );

      const { token, client } = response.data;

      sessionStorage.setItem('token', token);
      sessionStorage.setItem('client', JSON.stringify(client));
      setClient(client);

      setSuccess('Inscription réussie ! Redirection...');
      setTimeout(() => navigate('/'), 2000); // Redirection après 2s
    } catch (err) {
      setError("Erreur lors de l'inscription. Vérifiez vos informations.");
    }
  };

  return (
    <MDBContainer className="register-form">
      <div className="left-panel">
        <div className="text-center">
          <img
            src="/images/GF-logo.png"
            style={{ width: '120px' }}
            alt="logo"
          />
          <h4>Rejoignez GoFind</h4>
        </div>

        <p>Créez votre compte pour accéder à nos services</p>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        {success && (
          <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>
        )}

        <form onSubmit={handleRegister} className="input-container">
          <p className="inputlable">Nom: </p>
          <MDBInput
            id="input"
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />

          <p className="inputlable">Prenon :</p>
          <MDBInput
            id="input"
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            required
          />

          <p className="inputlable">Phone :</p>
          <MDBInput
            id="input"
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <p className="inputlable">Profile Picture :</p>
          <MDBInput
            id="input"
            type="text"
            name="profilePicture"
            value={formData.profilePicture}
            onChange={handleChange}
          />

          <p className="inputlable">Address :</p>
          <MDBInput
            id="input"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />

          <p className="inputlable">Email :</p>
          <MDBInput
            id="input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <p className="inputlable">Mot de passe :</p>
          <MDBInput
            id="input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <p className="inputlable">Confirmer :</p>
          <MDBInput
            id="input"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <MDBBtn className="register-btn" type="submit">
            Devenir Client
          </MDBBtn>
        </form>
      </div>

      <div className="register-right-panel">
        <div>
          <h4>Découvrez tout ce que GoFind a à offrir</h4>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <h4 className="devenirPro">Vous avez des services à proposez?</h4>
          <button
            className="register-btn"
            onClick={() => navigate('/prestataire_register')}
          >
            Devenir Prestataire
          </button>
        </div>
      </div>
    </MDBContainer>
  );
}

export default Register;
