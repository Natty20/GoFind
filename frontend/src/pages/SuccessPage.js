import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        // 🔥 récupération fiable du session_id depuis le hash
        const hash = window.location.hash;
        // ex: "#/success?session_id=cs_test_xxx"

        const queryIndex = hash.indexOf('?');
        if (queryIndex === -1) {
          console.error('❌ Aucun query string dans le hash');
          navigate('/cancel');
          return;
        }

        const queryString = hash.substring(queryIndex + 1);
        const params = new URLSearchParams(queryString);
        const sessionId = params.get('session_id');

        console.log('🧾 session_id récupéré :', sessionId);

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
        console.error('❌ Erreur confirmation paiement :', err);
        navigate('/cancel');
      }
    };

    confirmPayment();
  }, [navigate]);

  if (loading) {
    return <p>⏳ Validation du paiement...</p>;
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
