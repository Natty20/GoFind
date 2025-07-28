import React, { useState, useContext } from 'react';
import axios from 'axios';
import { MDBBtn, MDBContainer, MDBInput } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/All/Register.css';

function Register() {
  const navigate = useNavigate();
  const { setClient } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    profilePicture: '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // gérer les changements dans les inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePicture: file });
    }
  };

  // gérer l'inscription
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
        'http://localhost:5000/api/auth/register',
        {
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          profilePicture: 'https://via.placeholder.com/150',
          address: formData.address,
        }
      );

      console.log('✅ Réponse API :', response.data);

      const { token, client } = response.data;
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('client', JSON.stringify(client));
      setClient(client);

      setSuccess('Inscription réussie ! Redirection...');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error(
        "❌ Erreur d'inscription :",
        err.response?.data || err.message
      );
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Erreur inconnue lors de l'inscription.");
      }
    }
  };

  return (
    <MDBContainer className="register-form">
      <div className="left-panel">
        <div className="text-center">
          <h4>Rejoignez GoFind</h4>
        </div>

        <p>Créez votre compte pour accéder à nos services</p>

        {/* ✅ Affichage des erreurs ou succès */}
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        {success && (
          <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>
        )}

        {/* ✅ Ajout du formulaire */}
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

          <p className="inputlable">Photo de profil :</p>
          <input
            type="file"
            name="profilePicture"
            onChange={handleFileChange}
            accept="image/*"
            required
          />

          {formData.profilePicture && (
            <img
              src={URL.createObjectURL(formData.profilePicture)}
              alt="Preview"
              style={{ width: '10px', marginTop: '10px', borderRadius: '10px' }}
            />
          )}

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
        </div>
      </div>
    </MDBContainer>
  );
}

export default Register;
