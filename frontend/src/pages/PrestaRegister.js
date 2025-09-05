import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { MDBInput } from 'mdb-react-ui-kit';
import '../styles/All/Register.css';

const PrestataireRegister = () => {
  const navigate = useNavigate();
  const { setPrestataire } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    nom: '',
    phone: '',
    address: '',
    profilePicture: null,
    selectedPrestations: [],
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [prestations, setPrestations] = useState([]);
  const [sousPrestations, setSousPrestations] = useState({});
  const [selectedSousPrestations, setSelectedSousPrestations] = useState({});

  // Charger les prestations et sous-prestations depuis l'API
  useEffect(() => {
    axios
      .get('https://gofind-v9ee.onrender.com/api/prestations')
      .then((response) => {
        setPrestations(response.data.prestations);
        const sousPrestationsMap = {};
        response.data.prestations.forEach((prestation) => {
          sousPrestationsMap[prestation._id] = prestation.sousPrestations || [];
        });
        setSousPrestations(sousPrestationsMap);
      })
      .catch((error) =>
        console.error('Erreur lors du chargement des prestations', error)
      );
  }, []);

  // Gérer les changements des inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Gérer le fichier uploadé (photo de profil)
  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePicture: e.target.files[0] });
  };

  // Gérer la sélection des prestations
  const handlePrestationsChange = (e) => {
    const selectedIds = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData({ ...formData, selectedPrestations: selectedIds });

    // Réinitialiser les sous-prestations sélectionnées
    const newSelectedSousPrestations = {};
    selectedIds.forEach((prestationId) => {
      newSelectedSousPrestations[prestationId] = [];
    });
    setSelectedSousPrestations(newSelectedSousPrestations);
  };

  // Gérer la sélection des sous-prestations
  const handleSousPrestationsChange = (prestationId, e) => {
    const selectedIds = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedSousPrestations((prev) => ({
      ...prev,
      [prestationId]: selectedIds,
    }));
  };

  // Gérer l'inscription
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const data = new FormData();
      data.append('nom', formData.nom);
      data.append('phone', formData.phone);
      data.append('address', formData.address);
      if (formData.profilePicture) {
        data.append('profilePicture', formData.profilePicture);
      }
      data.append('email', formData.email);
      data.append('password', formData.password);

      // Transformer les prestations en format attendu par le backend
      const formattedPrestations = formData.selectedPrestations.map(
        (prestationId) => ({
          prestationId,
          selectedSousPrestations: selectedSousPrestations[prestationId] || [],
        })
      );

      data.append('selectedPrestations', JSON.stringify(formattedPrestations));

      console.log('📤 Données envoyées :', Object.fromEntries(data.entries())); // Debug

      const response = await axios.post(
        'https://gofind-v9ee.onrender.com/api/prestataires/register',
        data,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      const { token, prestataire } = response.data;

      sessionStorage.setItem('token', token);
      sessionStorage.setItem('prestataire', JSON.stringify(prestataire));
      setPrestataire(prestataire);

      setSuccess('Inscription réussie ! Redirection...');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('❌ Erreur API :', error.response?.data);
      setError(
        error.response?.data?.message || "Erreur lors de l'inscription."
      );
    }
  };

  return (
    <main className="register-form">
      <div className="register-left-panel">
        <div className="welcome-text">
          <img
            src={`${process.env.PUBLIC_URL}/images/GF-logo.png`}
            alt="GoFind - Plateforme de mise en relation entre clients et prestataires"
          />
          <h1>Rejoignez GoFind</h1>
          <p>Créez votre compte pour proposer vos services</p>
        </div>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        {success && (
          <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>
        )}

        <form onSubmit={handleRegister} className="register-input-container">
          <p className="label">Nom:</p>
          <MDBInput
            id="input"
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />

          <p className="label">Téléphone :</p>
          <MDBInput
            id="input"
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <p className="label">Adresse :</p>
          <MDBInput
            id="input"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />

          <p className="label">Photo de profil :</p>
          <MDBInput
            type="file"
            name="profilePicture"
            onChange={handleFileChange}
            required
          />

          <p className="label">Email :</p>
          <MDBInput
            id="input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <p className="label">Mot de passe :</p>
          <MDBInput
            id="input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <p className="label">Confirmer le mot de passe :</p>
          <MDBInput
            id="input"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <label>Choisissez vos prestations:</label>
          <select multiple onChange={handlePrestationsChange} required>
            {prestations.map((prestation) => (
              <option key={prestation._id} value={prestation._id}>
                {prestation.nom}
              </option>
            ))}
          </select>

          {formData.selectedPrestations.map((prestationId) => (
            <div key={prestationId}>
              <label>
                Sous-prestations pour{' '}
                {prestations.find((p) => p._id === prestationId)?.nom}:
              </label>
              <select
                multiple
                onChange={(e) => handleSousPrestationsChange(prestationId, e)}
              >
                {sousPrestations[prestationId]?.map((sousPrestation) => (
                  <option key={sousPrestation._id} value={sousPrestation._id}>
                    {sousPrestation.nom}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <button className="register-btn" type="submit">
            Devenir Prestataire
          </button>
        </form>
      </div>

      <div className="register-right-panel">
        <div>
          <h2>Découvrez tout ce que GoFind a à offrir</h2>
          <p>
            Avec GoFind, accédez à une large gamme de prestations pensées pour
            répondre à vos besoins. Notre plateforme met en relation clients et
            prestataires de confiance afin de simplifier votre quotidien.
          </p>
          <p>Vous avez déjà un compte chez GoFind?</p>
          <button
            className="register-btn"
            onClick={() => navigate('/prestataire_login')}
          >
            Connecter Vous
          </button>
        </div>
      </div>
    </main>
  );
};

export default PrestataireRegister;
