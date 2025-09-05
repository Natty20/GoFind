import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Récupère les infos passées via navigate(..., { state })
  const reservationInfo = location.state;

  const handleGoToPrestation = () => {
    navigate('/prestation');
  };

  const handleGoToReservations = () => {
    if (reservationInfo?.clientId) {
      navigate(`/liste_de_rdv/${reservationInfo.clientId}`);
    }
  };

  if (!reservationInfo) {
    return (
      <main className="demande-envoye">
        <div className="demande-envoyee-container">
          <h1>Informations de réservation manquantes.</h1>
          <p>
            Vous pouvez revenir à la page d&apos;accueil ou refaire votre
            demande.
          </p>
          <button onClick={() => navigate('/')}>Retour à l&apos;accueil</button>
        </div>
      </main>
    );
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
          <p>Votre rendez-vous a été confirmé.</p>
        </div>
        <div className="paiment-details">
          <div className="paiement-method">
            <p>Mode de paiement :</p>
            <strong>{reservationInfo.modePaiement || 'Carte'}</strong>
          </div>
          <div className="paiement-date">
            <p>Date :</p>
            <strong>{reservationInfo.date || 'Non définie'}</strong>
          </div>
        </div>
        <div className="actions">
          <button className="prestations" onClick={handleGoToPrestation}>
            Voir Nos Prestations
          </button>
          <button className="rendez-vous" onClick={handleGoToReservations}>
            Voir Mes Rendez-Vous
          </button>
        </div>
      </div>
    </main>
  );
};

export default Success;
