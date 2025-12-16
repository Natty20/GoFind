import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = sessionStorage.getItem('stripeSessionId');

    if (!sessionId) {
      console.error('❌ sessionId absent');
      navigate('/cancel');
      return;
    }

    axios
      .post('https://gofind-v9ee.onrender.com/api/stripe/confirm-payment', {
        sessionId,
      })
      .then(() => {
        sessionStorage.removeItem('stripeSessionId');
      })
      .catch(() => {
        navigate('/cancel');
      });
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
