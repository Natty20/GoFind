import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Client/Demande.css';

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    client,
    prestataire,
    selectedPayment = 'Carte via Stripe',
    montant,
    selectedDate,
  } = location.state || {};

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

  useEffect(() => {
    setTimeout(() => {
      navigate('/success');
    }, 5000);
  }, [navigate]);

  return (
    <main className="demande-envoye">
      <div className="demande-envoyee-container">
        <div className="icon">
          <div className="circle">
            <span>&#10004;</span>
          </div>
        </div>
        <div className="message">
          <h2>Paiement réussi !!</h2>
          <p>Votre rendez-vous a été confirmé!</p>
        </div>
        <div className="paiment-details">
          <div className="paiement-method">
            <p>Mode De Paiement:</p>
            <p>
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

export default SuccessPage;
