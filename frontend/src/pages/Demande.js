import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Client/Demande.css';

const DemandeEnvoyee = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { client, prestataire, selectedPayment, montant, selectedDate } =
    location.state || {};

  const handleGoToPrestation = () => {
    navigate('/prestation');
  };

  const handleGoToReservations = () => {
    navigate(`/liste_de_rdv/${client._id}`, {
      state: {
        client,
        prestataire,
        selectedPayment,
        montant,
        selectedDate,
      },
    });
  };

  return (
    <main className="demande-envoye">
      <div className="demande-envoyee-container">
        <div className="icon">
          <div className="circle">
            <span>&#10004;</span>
          </div>
        </div>
        <div className="message">
          <h2>Demande Envoyée</h2>
          <p>{montant}$</p>
        </div>
        <div className="paiment-details">
          <div className="paiement-method">
            <p>Mode De Paiement:</p>
            <p>
              {' '}
              <strong>{selectedPayment || 'Non spécifié'}</strong>
            </p>
          </div>
          <div className="paiement-date">
            <p>Date:</p>
            <p>
              <strong>{selectedDate || 'Non définie'}</strong>
            </p>
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

export default DemandeEnvoyee;
