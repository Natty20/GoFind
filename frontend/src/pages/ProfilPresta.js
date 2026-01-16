import React, { useEffect, useState } from 'react';
import '../styles/Prestataire/ProfilPresta.css';
import { FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';

import PropTypes from 'prop-types';
const ProfilPresta = () => {
  const [prestataire, setPrestataire] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [, setAllPrestations] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [avis, setAvis] = useState([]);
  const [avisLoading, setAvisLoading] = useState(true);

  const prestataireId = sessionStorage.getItem('prestataireId');
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    const fetchPrestataireData = async () => {
      if (!prestataireId) {
        setError('Prestataire non connecté...');
        setLoading(false);
        return;
      }
      try {
        const [prestaRes, prestationsRes] = await Promise.all([
          axios.get(
            `https://gofind-v9ee.onrender.com/api/prestataires/${prestataireId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get(`https://gofind-v9ee.onrender.com/api/prestations`),
        ]);
        setPrestataire(prestaRes.data.prestataire);
        setFormData(prestaRes.data.prestataire);
        setAllPrestations(prestationsRes.data.prestations);
      } catch (err) {
        setError('Erreur lors du chargement des informations.');
      } finally {
        setLoading(false);
      }
    };
    fetchPrestataireData();
  }, [prestataireId, token]);

  useEffect(() => {
    const fetchAvisPrestataire = async () => {
      try {
        const res = await axios.get(
          'https://gofind-v9ee.onrender.com/api/avis/prestataire',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAvis(res.data.avis);
      } catch (err) {
        setError('Erreur chargement avis', err);
      } finally {
        setAvisLoading(false);
      }
    };

    fetchAvisPrestataire();
  }, [token]);

  const handleToggleVisibility = async (avisId) => {
    try {
      const res = await axios.patch(
        `https://gofind-v9ee.onrender.com/api/avis/${avisId}/visibility`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAvis((prevAvis) =>
        prevAvis.map((a) => (a._id === avisId ? res.data.avis : a))
      );
    } catch (err) {
      setError('Erreur visibilité avis', err);
      alert("❌ Impossible de modifier la visibilité de l'avis");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, profilePicture: file });
  };

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

  // Upload Réalisation
  const handleUploadRea = async () => {
    try {
      if (!file) {
        alert('⚠️ Veuillez choisir un fichier avant de valider !');
        return;
      }

      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const uploadRes = await axios.post(
        `https://gofind-v9ee.onrender.com/api/prestataires/${prestataire._id}/realisations`,
        formDataUpload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setPrestataire(uploadRes.data.prestataire);
      setFile(null);
      alert('✅ Réalisation ajoutée avec succès !');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(
        "Erreur lors de l'ajout de la réalisation :",
        err.response?.data || err
      );
      alert("❌ Impossible d'ajouter la réalisation. Réessayez.");
    }
  };

  // Supprimer une réalisation
  const handleDeleteRea = async (imageUrl) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette réalisation?'))
      return;
    try {
      const res = await axios.delete(
        `https://gofind-v9ee.onrender.com/api/prestataires/${prestataire._id}/realisations/${encodeURIComponent(imageUrl)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPrestataire(res.data.prestataire);
      alert('✅ Réalisation supprimée !');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(
        'Erreur lors de la suppression :',
        err.response?.data || err
      );
      alert('❌ Impossible de supprimer la réalisation.');
    }
  };

  //  Sauvegarde profil
  const handleSave = async () => {
    try {
      let profilePictureUrl = formData.profilePicture;
      if (formData.profilePicture instanceof File) {
        profilePictureUrl = await uploadImageToBackend(formData.profilePicture);
      }

      const payload = {
        nom: formData.nom || prestataire.nom,
        prenom: formData.prenom || prestataire.prenom,
        email: formData.email || prestataire.email,
        phone: formData.phone || prestataire.phone || '',
        address: formData.address || prestataire.address || '',
        description: formData.description || prestataire.description || '',
        profilePicture: profilePictureUrl || prestataire.profilePicture || '',
      };

      const res = await axios.put(
        `https://gofind-v9ee.onrender.com/api/prestataires/${prestataireId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPrestataire(res.data.prestataire);
      setFormData(res.data.prestataire);
      setIsEditing(false);
      alert('✅ Profil mis à jour !');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err.response?.data || err);
      alert('❌ Impossible de mettre à jour le profil.');
    }
  };
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
        const res = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(val)}&type=municipality&limit=6`
        );
        const data = await res.json();
        setSuggestions(data.features.map((f) => f.properties.city));
      } catch (err) {
        // eslint-disable-next-line no-console
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

  // Définition des props attendues
  CityInput.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  };

  if (loading) return <p>Chargement des informations...</p>;
  if (error)
    return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;

  return (
    <main className="compte-presta">
      <section className="info">
        <div className="info-presta">
          <img
            src={
              typeof formData.profilePicture === 'string'
                ? formData.profilePicture
                : URL.createObjectURL(formData.profilePicture) ||
                  'https://www.swendoperio.com/wp-content/uploads/2019/11/person-icon.png'
            }
            alt={`Photo de ${formData.nom} ${formData.prenom}`}
            className="profile-pic"
          />

          {!isEditing ? (
            <div className="presta-names">
              <h1>
                {prestataire.nom} {prestataire.prenom}
              </h1>
              <h2>
                Prestation(s) :{' '}
                {prestataire.selectedPrestations
                  .map((item) => item.prestationId?.nom)
                  .filter(Boolean)
                  .join(' • ')}
              </h2>

              <p>
                <strong>Email : {prestataire.email}</strong>
              </p>
              <p>Téléphone : {prestataire.phone || 'Non renseigné'}</p>

              <p className="location">
                <FaMapMarkerAlt />{' '}
                {prestataire.address || 'Adresse non renseignée'}
              </p>
              <p className="span">
                {prestataire.realisations?.length || 0} Réalisations
              </p>

              <button
                className="btn-secondary"
                onClick={() => setIsEditing(true)}
              >
                Modifier
              </button>
            </div>
          ) : (
            <div className="form-edit">
              <input
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                placeholder="Nom"
              />
              <input
                name="prenom"
                value={formData.prenom}
                onChange={handleInputChange}
                placeholder="Prénom"
              />
              <input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
              />
              <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Téléphone"
              />
              <CityInput
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Adresse"
              />
              <input />
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                placeholder="Présentez votre activité, votre expérience, vos spécialités..."
                rows={5}
                maxLength={1500}
              />

              <input
                type="file"
                name="profilePicture"
                onChange={handleFileChange}
                accept="image/*"
              />
              {formData.profilePicture && (
                <img
                  src={
                    typeof formData.profilePicture === 'string'
                      ? formData.profilePicture
                      : URL.createObjectURL(formData.profilePicture)
                  }
                  alt="Preview"
                  style={{
                    width: '50px',
                    marginTop: '10px',
                    borderRadius: '30px',
                  }}
                />
              )}
              <button className="btn-secondary" onClick={handleSave}>
                Enregistrer
              </button>
              <button
                className="btn-primary"
                onClick={() => setIsEditing(false)}
              >
                Annuler
              </button>
            </div>
          )}
        </div>
      </section>
      {prestataire?.description?.length > 0 && (
        <section className="presta-description">
          <h2 className="tittles">À propos</h2>
          <p>{prestataire.description}</p>
        </section>
      )}

      <section className="realisations-container">
        <h3 className="tittles">Mes Réalisations</h3>

        {/* Upload d'une nouvelle réalisation */}
        <div className="add-realisation">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button className="btn-secondary" onClick={handleUploadRea}>
            Ajouter
          </button>
        </div>

        {/* Grille des réalisations existantes */}
        {prestataire?.realisations?.length > 0 ? (
          <div className="images-grid">
            {prestataire.realisations.map((imgUrl, index) => (
              <div key={index} className="image-wrapper">
                <img
                  src={imgUrl}
                  alt={`Réalisation ${index + 1}`}
                  className="realisation-img"
                />
                <button
                  className="btn-primary"
                  onClick={() => handleDeleteRea(imgUrl)}
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucune réalisation pour le moment.</p>
        )}
      </section>

      <section className="clients-avis">
        <div className="provider-reviews">
          <h2 className="tittles">Avis des clients</h2>

          {avisLoading ? (
            <p>Chargement des avis...</p>
          ) : avis.length === 0 ? (
            <p>Aucun avis pour le moment.</p>
          ) : (
            avis.map((item) => (
              <article
                key={item._id}
                className={`review ${!item.visible ? 'review-hidden' : ''}`}
              >
                <div className="review-info">
                  <img
                    src={item.auteur?.profilePicture}
                    alt="Client"
                    className="client-image"
                  />
                  <h3>{item.auteur?.prenom || 'Client'}</h3>
                </div>

                {item.note && <p className="note">⭐ {item.note}/5</p>}

                <p>{item.commentaire}</p>

                <span>
                  {new Date(item.createdAt).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>

                <button
                  className="btn-secondary"
                  onClick={() => handleToggleVisibility(item._id)}
                >
                  {item.visible ? 'Masquer' : 'Rendre visible'}
                </button>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default ProfilPresta;
