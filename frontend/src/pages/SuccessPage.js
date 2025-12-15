import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SuccessPage = () => {
  const navigate = useNavigate();
  const [reservationInfo, setReservationInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get(
      'session_id'
    );

    if (!sessionId) {
      setLoading(false);
      return;
    }

    axios
      .post('https://gofind-v9ee.onrender.com/api/stripe/confirm-payment', {
        sessionId,
      })
      .then((res) => {
        setReservationInfo(res.data.reservation);
      })
      .catch((err) => {
        console.error('Erreur confirmation paiement:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Validation du paiement en cours...</p>;
  }

  if (!reservationInfo) {
    return (
      <main className="demande-envoye">
        <h1>Informations de réservation manquantes</h1>
        <button onClick={() => navigate('/')}>Retour accueil</button>
      </main>
    );
  }

  return (
    <main className="demande-envoye">
      <div className="demande-envoyee-container">
        <h2>🎉 Paiement réussi !</h2>
        <p>Votre réservation a bien été enregistrée.</p>

        <p>
          <strong>Date :</strong> {reservationInfo.date}
        </p>
        <p>
          <strong>Heure :</strong> {reservationInfo.heure}
        </p>
        <p>
          <strong>Paiement :</strong> {reservationInfo.modePaiement}
        </p>

        <button onClick={() => navigate('/prestation')}>
          Voir nos prestations
        </button>

        <button
          onClick={() => navigate(`/liste_de_rdv/${reservationInfo.clientId}`)}
        >
          Voir mes rendez-vous
        </button>
      </div>
    </main>
  );
};

export default SuccessPage;
