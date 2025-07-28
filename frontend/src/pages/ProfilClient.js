import React, { useState, useEffect } from 'react';
import { FaCog, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';
import '../styles/Client/ProfilClient.css';

const ClientProfile = () => {
  const [client, setClient] = useState(null);
  const [rdvs, setRdvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const clientId = sessionStorage.getItem('clientId');
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    const fetchClientData = async () => {
      if (!clientId || !token) {
        setError('Utilisateur non connecté ou token manquant.');
        setLoading(false);
        return;
      }

      try {
        const [clientRes, rdvRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/auth/${clientId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(
            `http://localhost:5000/api/reservations/client/${clientId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        setClient(clientRes.data.client);
        setRdvs(rdvRes.data || []);
      } catch (err) {
        console.error(err);
        setError('Erreur lors du chargement des données.');
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [clientId, token]);

  if (loading) return <p>Chargement des informations...</p>;
  if (error)
    return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;

  const now = new Date();

  // Filtrage selon "etat" (état = en attente, acceptée, déclinée)
  const rdvAVenir = rdvs.filter(
    (r) => new Date(r.date) > now && r.etat === 'acceptée'
  );
  const rdvTermines = rdvs.filter(
    (r) => new Date(r.date) <= now && r.etat === 'terminé'
  );
  const rdvAnnules = rdvs.filter(
    (r) => r.etat === 'declinée' || r.etat === 'annulé'
  );

  // Formatage date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="container">
      {/* Profil client */}
      <div className="profile-card">
        <div className="settings-icon">
          <FaCog />
        </div>
        <div className="profile-info">
          <img
            src={
              client?.profilePicture ||
              'https://www.swendoperio.com/wp-content/uploads/2019/11/person-icon.png'
            }
            alt="Profil"
            className="profile-pic"
          />
          <h2>
            {client?.nom} {client?.prenom}
          </h2>
          <p className="location">
            <FaMapMarkerAlt /> {client?.address || 'Adresse non renseignée'}
          </p>
          <p>Email : {client?.email}</p>
          <p>Téléphone : {client?.phone || 'Non renseigné'}</p>
        </div>
      </div>

      {/* Statistiques rendez-vous */}
      <h2 className="section-title">Vos Rendez-Vous</h2>
      <div className="appointments">
        <div className="appointment">
          <span className="number green">{rdvAVenir.length}</span>
          <p className="gray-text">À Venir</p>
        </div>
        <div className="appointment">
          <span className="number blue">{rdvTermines.length}</span>
          <p>Terminés</p>
        </div>
        <div className="appointment">
          <span className="number red">{rdvAnnules.length}</span>
          <p>Annulés</p>
        </div>
      </div>

      {/* Liste détaillée des RDV */}

      {rdvAVenir.length > 0 && (
        <div className="rdv-section">
          <h3 className="rdv-title">À venir</h3>
          {rdvAVenir.map((r) => (
            <div key={r._id} className="rdv-card avenir">
              <div className="coordonees-details">
                <img
                  src={
                    r.prestataire?.profilePicture ||
                    'https://www.swendoperio.com/wp-content/uploads/2019/11/person-icon.png'
                  }
                  alt={r.prestataire?.nom || 'Prestataire'}
                />
                <p>
                  <strong>Prestataire :</strong> {r.prestataire?.nom || 'N/A'}
                </p>
              </div>

              <p>
                <strong>Date :</strong> {formatDate(r.date)}
              </p>
              <p>
                <strong>Heure :</strong> {r.heure || 'N/A'}
              </p>
              <p>
                <strong>Mode de paiement :</strong> {r.modePaiement || 'N/A'}
              </p>
              <p>
                <strong>Description :</strong>{' '}
                {r.description || 'Aucune description'}
              </p>

              <div className="prestation-detail">
                <strong>Prestations :</strong>
                <ul>
                  {r.prestations?.map((p) => (
                    <li key={p._id}>
                      {p.prestationId?.nom}
                      {p.sousPrestations && p.sousPrestations.length > 0 && (
                        <ul>
                          {p.sousPrestations.map((sp) => (
                            <li key={sp._id}>{sp.nom}</li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <p>
                <strong>État :</strong>{' '}
                <span
                  className={`etat etat-${r.etat.replace('é', 'e').replace(' ', '')}`}
                >
                  {r.etat.charAt(0).toUpperCase() + r.etat.slice(1)}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}

      {rdvTermines.length > 0 && (
        <div className="rdv-section">
          <h3 className="rdv-title">Terminés</h3>
          {rdvTermines.map((r) => (
            <div key={r._id} className="rdv-card termine">
              <p>
                <strong>Prestataire :</strong> {r.prestataireNom || 'N/A'}
              </p>
              <p>
                <strong>Date :</strong> {formatDate(r.date)}
              </p>
              <p>
                <strong>État :</strong>{' '}
                <span className="etat etat-termine">Terminé</span>
              </p>
            </div>
          ))}
        </div>
      )}

      {rdvAnnules.length > 0 && (
        <div className="rdv-section">
          <h3 className="rdv-title">Annulés</h3>
          {rdvAnnules.map((r) => (
            <div key={r._id} className="rdv-card annule">
              <p>
                <strong>Prestataire :</strong> {r.prestataireNom || 'N/A'}
              </p>
              <p>
                <strong>Date :</strong> {formatDate(r.date)}
              </p>
              <p>
                <strong>État :</strong>{' '}
                <span className="etat etat-declinee">Déclinée</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientProfile;
