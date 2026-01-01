import React, { useState, useContext } from 'react';
import axios from 'axios';
import { MDBBtn, MDBContainer, MDBInput } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PropTypes from 'prop-types';
import '../styles/All/Register.css';

// Upload image sur backend
const uploadImageToBackend = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const res = await axios.post(
    'https://gofind-v9ee.onrender.com/api/upload/image',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );

  return res.data.url;
};

// Composant pour lees villes
const CityInput = ({ value, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState(value || '');

  const handleInputChange = async (e) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);

    if (val.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(`/api/cities?q=${encodeURIComponent(val)}`);
      const data = await res.json();
      setSuggestions(data.features.map((f) => f.properties.city));
    } catch (err) {
      console.error('Erreur autocomplete villes', err);
    }
  };

  const handleSelect = (city) => {
    setQuery(city);
    onChange(city);
    setSuggestions([]);
  };

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Choisissez votre ville"
        required
        style={{ width: '100%', padding: '8px' }}
      />
      {suggestions.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'white',
            border: '1px solid #ccc',
            maxHeight: '150px',
            overflowY: 'auto',
            zIndex: 10,
            margin: 0,
            padding: 0,
            listStyle: 'none',
          }}
        >
          {suggestions.map((city, i) => (
            <li
              key={i}
              onClick={() => handleSelect(city)}
              style={{ padding: '8px', cursor: 'pointer' }}
              onMouseDown={(e) => e.preventDefault()}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// 🔹 Définition des props attendues
CityInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, profilePicture: file });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas!');
      return;
    }

    try {
      let profilePictureUrl = '';
      if (formData.profilePicture instanceof File) {
        profilePictureUrl = await uploadImageToBackend(formData.profilePicture);
      }

      const response = await axios.post(
        'https://gofind-v9ee.onrender.com/api/auth/register',
        {
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
          profilePicture: profilePictureUrl,
        }
      );

      const { token, client } = response.data;
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('clientId', client._id);
      sessionStorage.setItem('client', JSON.stringify(client));
      setClient(client);

      setSuccess('Inscription réussie ! Redirection...');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Erreur lors de l'inscription.");
    }
  };

  return (
    <main className="register-page">
      <div className="register-left-panel">
        <div className="welcome-text">
          <img
            src={`${process.env.PUBLIC_URL}/images/GF-logo.png`}
            alt="GoFind - Plateforme de mise en relation"
          />
          <h1>Rejoignez GoFind</h1>
          <p>Créez votre compte pour accéder à nos services</p>
        </div>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        {success && (
          <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>
        )}

        <form onSubmit={handleRegister} className="register-input-container">
          <p className="label">Nom: </p>
          <MDBInput
            id="nom"
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />

          <p className="label">Prénom :</p>
          <MDBInput
            id="prenom"
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            required
          />

          <p className="label">Phone :</p>
          <MDBInput
            id="phone"
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <p className="label">Photo de profil :</p>
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
              style={{ width: '50px', marginTop: '10px', borderRadius: '30px' }}
            />
          )}

          <p className="label">Ville :</p>
          <CityInput
            id="nom"
            value={formData.address}
            onChange={(val) => setFormData({ ...formData, address: val })}
          />

          <p className="label">Email :</p>
          <MDBInput
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <p className="label">Mot de passe :</p>
          <MDBInput
            id="mdp"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <p className="label">Confirmer :</p>
          <MDBInput
            id="mdp-confirmer"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button className="btn-secondary" type="submit">
            Devenir Client
          </button>
        </form>
      </div>

      <div className="register-right-panel">
        <div className="about">
          <h2>Découvrez tout ce que GoFind a à offrir</h2>
          <p>
            Avec GoFind, accédez à une large gamme de prestations pensées pour
            répondre à vos besoins. Notre plateforme met en relation clients et
            prestataires de confiance afin de simplifier votre quotidien.
          </p>
        </div>
      </div>
    </main>
  );
}

export default Register;
