// frontend/pages/SuccessPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SuccessPage = () => {
  const navigate = useNavigate();
  const [reservationSaved, setReservationSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get(
      'session_id'
    );

    if (!sessionId) {
      setError('Session manquante.');
      return;
    }

    const confirmPayment = async () => {
      try {
        const res = await axios.post(
          'https://gofind-v9ee.onrender.com/api/stripe/confirm-payment',
          { sessionId }
        );

        if (res.data.success) {
          setReservationSaved(true);
        } else {
          setError('Erreur lors de la sauvegarde de la réservation.');
        }
      } catch (err) {
        console.error(err);
        setError('Erreur lors de la confirmation du paiement.');
      }
    };

    confirmPayment();
  }, []);

  if (error) {
    return (
      <main className="demande-envoye">
        <div className="demande-envoyee-container">
          <h1>❌ {error}</h1>
          <button onClick={() => navigate('/')}>Retour à l'accueil</button>
        </div>
      </main>
    );
  }

  if (!reservationSaved) {
    return <p>Chargement de la confirmation de réservation...</p>;
  }

  return (
    <main className="demande-envoye">
      <div className="demande-envoyee-container">
        <div className="icon">
          <div className="circle">
            <span>&#10004;</span>
          </div>
        </div>
        <div className="message">
          <h2>Paiement réussi ! 🎉</h2>
          <p>Votre demande de rendez-vous a été envoyée au prestataire.</p>
        </div>
        <button onClick={() => navigate('/prestation')}>
          Voir Nos Prestations
        </button>
        <button onClick={() => navigate('/')}>Retour à l'accueil</button>
      </div>
    </main>
  );
};

export default SuccessPage;
