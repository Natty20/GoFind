import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Client/RdvClient.css';

const RdvClient = () => {
  const [rdvs, setRdvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const clientId = sessionStorage.getItem('clientId');
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    const fetchRdvs = async () => {
      if (!clientId || !token) {
        setError('Utilisateur non connecté');
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(
          `https://gofind-v9ee.onrender.com/api/reservations/client/${clientId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRdvs(res.data || []);
      } catch (err) {
        console.error(err);
        setError('Erreur lors du chargement des rendez-vous.');
      } finally {
        setLoading(false);
      }
    };

    fetchRdvs();
  }, [clientId, token]);

  const now = new Date();
  const normalize = (str) =>
    str
      ?.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const rdvAVenir = rdvs.filter(
    (r) => new Date(r.date) > now && normalize(r.etat) === 'acceptee'
  );
  const rdvPending = rdvs.filter(
    (r) => new Date(r.date) > now && normalize(r.etat) === 'en attente'
  );
  const rdvAnnules = rdvs.filter((r) => normalize(r.etat) === 'declinee');
  const rdvTermines = rdvs.filter(
    (r) => new Date(r.date) <= now && normalize(r.etat) !== 'declinee'
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  if (loading) return <p>Chargement des rendez-vous...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  const renderRdvSection = (title, rdvList, className) =>
    rdvList.length > 0 && (
      <div className="rdv-section">
        <h3 className="rdv-title">{title}</h3>
        {rdvList.map((r) => (
          <div key={r._id} className={`rdv-card ${className}`}>
            <p>
              <strong>Prestataire :</strong>{' '}
              {r.prestataire
                ? `${r.prestataire.nom} ${r.prestataire.prenom}`
                : 'N/A'}
            </p>
            <p>
              <strong>Date :</strong> {formatDate(r.date)}
            </p>
            <p>
              <strong>Heure :</strong> {r.heure || 'N/A'}
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
          </div>
        ))}
      </div>
    );

  return (
    <div className="rdvclient-container">
      <h2>Vos Rendez-Vous</h2>
      <div className="appointments-summary">
        <div className="appointment">
          <span className="number green">{rdvAVenir.length}</span>
          <p>À Venir</p>
        </div>
        <div className="appointment">
          <span className="number blue">{rdvTermines.length}</span>
          <p>Terminés</p>
        </div>
        <div className="appointment">
          <span className="number orange">{rdvPending.length}</span>
          <p>En Attente</p>
        </div>
        <div className="appointment">
          <span className="number red">{rdvAnnules.length}</span>
          <p>Annulés</p>
        </div>
      </div>

      {renderRdvSection('À venir', rdvAVenir, 'avenir')}
      {renderRdvSection('Terminés', rdvTermines, 'termine')}
      {renderRdvSection('En Attente', rdvPending, 'pending')}
      {renderRdvSection('Annulés', rdvAnnules, 'annule')}
    </div>
  );
};

export default RdvClient;
