import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Prestataire/Reservation.css';

const ListeDemandesPrestataire = () => {
  const [prestataireId, setPrestataireId] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Récupération du prestataire depuis sessionStorage
  useEffect(() => {
    try {
      const storedPresta = JSON.parse(sessionStorage.getItem('prestataire'));
      if (storedPresta?._id) {
        setPrestataireId(storedPresta._id);
      }
    } catch (err) {
      console.error('Erreur lors de la lecture du prestataire :', err);
    }
  }, []);

  const fetchReservations = async () => {
    if (!prestataireId) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `https://gofind-v9ee.onrender.com/api/reservations/prestataire/${prestataireId}`
      );
      setReservations(res.data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des réservations.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatut = async (reservationId, action) => {
    try {
      const endpoint = `https://gofind-v9ee.onrender.com/api/reservations/${reservationId}/${action}`;
      await axios.put(endpoint);
      fetchReservations(); // Refresh après update
    } catch (error) {
      console.error('Erreur lors de la mise à jour :', error);
    }
  };

  const handleStatusChange = async (reservationId, newStatus) => {
    try {
      await axios.put(
        `https://gofind-v9ee.onrender.com/api/reservations/${reservationId}/update-etat`,
        { etat: newStatus }
      );
      fetchReservations();
    } catch (error) {
      console.error('Erreur lors du changement de statut :', error);
    }
  };

  useEffect(() => {
    if (prestataireId) {
      fetchReservations();
    }
  }, [prestataireId]);

  const renderNouvellesReservations = () => {
    const enAttente = reservations.filter((res) => res.etat === 'en attente');

    if (enAttente.length === 0) {
      return (
        <tr>
          <td colSpan="4" style={{ textAlign: 'center', fontStyle: 'italic' }}>
            Aucune nouvelle réservation.
          </td>
        </tr>
      );
    }

    return enAttente.map((res) => (
      <tr key={res._id}>
        <td>
          <p>
            <strong>{res.client.nom}</strong>
          </p>
          <p>{res.client.prenom}</p>
          <p>{res.client.phone}</p>
        </td>
        <td>{res.description}</td>
        <td>{new Date(res.date).toLocaleString('fr-FR')}</td>
        <td>
          <button onClick={() => updateStatut(res._id, 'accept')}>
            Accepter
          </button>
          <button onClick={() => updateStatut(res._id, 'decline')}>
            Refuser
          </button>
        </td>
      </tr>
    ));
  };

  const renderRendezVous = () => {
    const autres = reservations.filter((res) => res.etat !== 'en attente');

    if (autres.length === 0) {
      return (
        <tr>
          <td colSpan="6" style={{ textAlign: 'center', fontStyle: 'italic' }}>
            Aucun rendez-vous.
          </td>
        </tr>
      );
    }

    return autres.map((res) => (
      <tr key={res._id}>
        <td>
          <p>
            <strong>{res.client.nom}</strong>
          </p>
          <p>{res.client.prenom}</p>
          <p>{res.client.phone}</p>
        </td>
        <td>{res.description}</td>
        <td>{new Date(res.date).toLocaleString('fr-FR')}</td>
        <td>
          <select
            value={res.etat}
            onChange={(e) => handleStatusChange(res._id, e.target.value)}
          >
            <option value="acceptée">Acceptée</option>
            <option value="déclinée">Annulée</option>
          </select>
        </td>
        <td>{res.modePaiement || '—'}</td>
        <td>
          {res.facture ? (
            <a href={res.facture} target="_blank" rel="noopener noreferrer">
              Voir
            </a>
          ) : (
            '—'
          )}
        </td>
      </tr>
    ));
  };

  return (
    <main className="reservation">
      <h1>Nouvelles Réservations</h1>

      {loading && <p>Chargement...</p>}
      {error && !loading && <p style={{ color: 'red' }}>{error}</p>}

      <section className="rdv-table">
        <table>
          <thead>
            <tr>
              <th>Client</th>
              <th>Description</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{renderNouvellesReservations()}</tbody>
        </table>
      </section>

      <section className="rdv-confirmes">
        <h2>Mes Rendez-vous</h2>
        <table>
          <thead>
            <tr>
              <th>Client</th>
              <th>Description</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Mode de Paiement</th>
              <th>Facture</th>
            </tr>
          </thead>
          <tbody>{renderRendezVous()}</tbody>
        </table>
      </section>

      {/* <pre>{JSON.stringify(reservations, null, 2)}</pre> */}
    </main>
  );
};

export default ListeDemandesPrestataire;
