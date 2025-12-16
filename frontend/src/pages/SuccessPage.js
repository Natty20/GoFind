import { useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const confirmPayment = async () => {
      const params = new URLSearchParams(location.search);
      const sessionId = params.get('session_id');

      if (!sessionId) {
        console.error('❌ session_id manquant');
        return;
      }

      try {
        await axios.post(
          'https://gofind-v9ee.onrender.com/api/stripe/confirm-payment',
          { sessionId }
        );

        console.log('✅ Réservation enregistrée');
      } catch (err) {
        console.error(
          '❌ Erreur confirmation:',
          err.response?.data || err.message
        );
      }
    };

    confirmPayment();
  }, [location]);

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
        <button className="btn-primary" onClick={() => navigate('/prestation')}>
          Voir Nos Prestations
        </button>
        <button className="btn-secondary" onClick={() => navigate('/')}>
          Retour à l&apos;accueil
        </button>
      </div>
    </main>
  );
};

export default SuccessPage;
