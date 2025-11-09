import React, { useState, useEffect } from 'react';
import { FaCog, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';
import '../styles/Client/ProfilClient.css';

const ClientProfile = () => {
  const [client, setClient] = useState(null);
  const [rdvs, setRdvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

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
          axios.get(`https://gofind-v9ee.onrender.com/api/auth/${clientId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(
            `https://gofind-v9ee.onrender.com/api/reservations/client/${clientId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        setClient(clientRes.data.client);
        setFormData(clientRes.data.client); // Préremplir formulaire
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `https://gofind-v9ee.onrender.com/api/auth/${clientId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setClient(res.data.client); // mettre à jour l’état
      setEditMode(false);
      alert('✅ Profil mis à jour avec succès !');
    } catch (err) {
      console.error(err);
      alert('❌ Erreur lors de la mise à jour du profil.');
    }
  };

  if (loading) return <p>Chargement des informations...</p>;
  if (error)
    return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;

  const now = new Date();

  const rdvAVenir = rdvs.filter(
    (r) => new Date(r.date) > now && r.etat === 'acceptée'
  );
  const rdvTermines = rdvs.filter(
    (r) => new Date(r.date) <= now && r.etat === 'terminé'
  );
  const rdvAnnules = rdvs.filter((r) => r.etat === 'declinée');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="profilclient-container">
      {/* Profil client */}
      <div className="profile-card">
        <div className="settings-icon" onClick={() => setEditMode(!editMode)}>
          <FaCog />
        </div>

        {!editMode ? (
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
              placeholder="Nom"
            />

            <p className="label">Prénom: </p>
            <input
              type="text"
              name="prenom"
              value={formData.prenom || ''}
              onChange={handleChange}
              placeholder="Prénom"
            />

            <p className="label">Email: </p>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              placeholder="Email"
            />

            <p className="label">Téléphone: </p>
            <input
              type="text"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              placeholder="Téléphone"
            />

            <p className="label">Address: </p>
            <input
              type="text"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              placeholder="Adresse"
            />
            <p className="label">Photo de profile: </p>
            <input
              name="profilePicture"
              value={formData.profilePicture}
              onChange={handleChange}
              placeholder="URL de la photo de profil"
            />

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
