import React, { useState, useEffect } from 'react';
import { FaCog, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';
import '../styles/Client/ProfilClient.css';

const ClientProfile = () => {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const clientId = localStorage.getItem('clientId'); // ✅ Récupérer l'ID du client stocké
  console.log('Client ID récupéré :', clientId);

  useEffect(() => {
    const fetchClientData = async () => {
      if (!clientId) {
        setError('Utilisateur non connecté.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:2000/api/auth/clients/${clientId}`
        );
        setClient(response.data.client); // ✅ `client` est bien dans `response.data.client`
        console.log('Données du client récupérées :', response.data.client);
      } catch (err) {
        setError('Erreur lors du chargement des informations.');
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [clientId]);

  if (loading) return <p>Chargement des informations...</p>;
  if (error)
    return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;

  return (
    <div className="container">
      {/* 🔹 Profil du client */}
      <div className="profile-card">
        <div className="settings-icon">
          <FaCog />
        </div>
        <div className="profile-info">
          <img
            src={
              client.profilePicture && client.profilePicture !== ''
                ? client.profilePicture
                : 'https://via.placeholder.com/80'
            }
            alt="Profil"
            className="profile-pic"
          />
          <h2>
            {client.nom} {client.prenom}
          </h2>
          <p className="location">
            <FaMapMarkerAlt />{' '}
            {client.address && client.address !== ''
              ? client.address
              : 'Adresse non renseignée'}
          </p>
          <p>Email : {client.email}</p>
          <p>Téléphone : {client.phone || 'Non renseigné'}</p>
        </div>
      </div>

      {/* 🔹 Rendez-vous du client */}
      <h2 className="section-title">Vos Rendez-Vous</h2>
      <div className="appointments">
        <div className="appointment">
          <span className="number red">{client.rdvTermines || 0}</span>
          <p>Rendez-Vous Terminés</p>
        </div>
        <div className="appointment">
          <span className="number gray">{client.rdvAVenir || 0}</span>
          <p className="gray-text">Rendez-Vous À Venir</p>
        </div>
        <div className="appointment">
          <span className="number red">{client.rdvAnnules || 0}</span>
          <p>Rendez-Vous Annulés</p>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
