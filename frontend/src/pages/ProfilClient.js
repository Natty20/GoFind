import React, { useState, useEffect } from 'react';
import { FaCog, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';
import '../styles/Client/ProfilClient.css';

const ClientProfile = () => {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const clientId = sessionStorage.getItem('clientId');
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    const fetchClientData = async () => {
      if (!clientId || !token) {
        setError('Utilisateur non connecté');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `https://gofind-v9ee.onrender.com/api/auth/${clientId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setClient(res.data.client);
        setFormData(res.data.client); // Préremplir formulaire
      } catch (err) {
        console.error(err);
        setError('Erreur lors du chargement des informations.');
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [clientId, token]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return res.data.url;
  };

  const handleUpdate = async () => {
    try {
      let profilePictureUrl = formData.profilePicture;

      if (formData.profilePicture instanceof File) {
        profilePictureUrl = await uploadImageToBackend(formData.profilePicture);
      }

      const payload = { ...formData, profilePicture: profilePictureUrl };

      const res = await axios.put(
        `https://gofind-v9ee.onrender.com/api/auth/${clientId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setClient(res.data.client);
      setFormData(res.data.client);
      setIsEditing(false);
      alert('✅ Informations mises à jour avec succès !');
    } catch (err) {
      console.error(err);
      alert('❌ Erreur lors de la mise à jour du profil.');
    }
  };

  if (loading) return <p>Chargement des informations...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="profilclient-container">
      <div className="profile-card">
        <div className="settings-icon" onClick={() => setIsEditing(!isEditing)}>
          <FaCog />
        </div>

        {!isEditing ? (
          <div className="profile-info">
            <img
              src={
                client?.profilePicture ||
                'https://www.swendoperio.com/wp-content/uploads/2019/11/person-icon.png'
              }
              alt="Profil"
              className="profile-pic"
            />
            <h1>
              {client?.nom} {client?.prenom}
            </h1>
            <p className="location">
              <FaMapMarkerAlt /> {client?.address || 'Adresse non renseignée'}
            </p>
            <p>Email : {client?.email}</p>
            <p>Téléphone : {client?.phone || 'Non renseigné'}</p>
          </div>
        ) : (
          <div className="form-edit">
            <p className="label">Nom: </p>
            <input
              type="text"
              name="nom"
              value={formData.nom || ''}
              onChange={handleChange}
            />
            <p className="label">Prénom: </p>
            <input
              type="text"
              name="prenom"
              value={formData.prenom || ''}
              onChange={handleChange}
            />
            <p className="label">Email: </p>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
            />
            <p className="label">Téléphone: </p>
            <input
              type="number"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
            />
            <p className="label">Adresse: </p>
            <input
              type="text"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
            />
            <p className="label">Photo de profile: </p>
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
            <p className="label">Mot de passe: </p>
            <input
              type="password"
              name="password"
              value={formData.password || ''}
              onChange={handleChange}
              placeholder="Nouveau mot de passe"
            />
            <button className="btn-secondary" onClick={handleUpdate}>
              Mettre à jour
            </button>
            <button className="btn-primary" onClick={() => setIsEditing(false)}>
              Annuler
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientProfile;
