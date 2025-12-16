import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        // 🔥 récupération depuis le HASH
        const hash = window.location.hash;
        const queryString = hash.split('?')[1];
        const params = new URLSearchParams(queryString);
        const sessionId = params.get('session_id');

        if (!sessionId) {
          console.error('❌ session_id introuvable');
          navigate('/cancel');
          return;
        }

        await axios.post(
          'https://gofind-v9ee.onrender.com/api/stripe/confirm-payment',
          { sessionId }
        );

        setLoading(false);
      } catch (err) {
        console.error('❌ Confirmation échouée :', err);
        navigate('/cancel');
      }
    };

    confirmPayment();
  }, [navigate]);

  if (loading) return <p>Validation du paiement...</p>;

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
