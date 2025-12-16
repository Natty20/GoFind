import { useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const confirmPayment = async () => {
      // Stripe envoie ?session_id=...
      const params = new URLSearchParams(location.search);
      const sessionId = params.get('session_id');

      if (!sessionId) {
        alert('❌ Session manquante.');
        return;
      }

      try {
        await axios.post(
          'https://gofind-v9ee.onrender.com/api/stripe/confirm-payment',
          { sessionId }
        );
        alert('✅ Réservation enregistrée !');
        navigate('/dashboard'); // ou autre page
      } catch (err) {
        console.error('Erreur confirmation paiement:', err);
        alert('❌ Impossible d’enregistrer la réservation');
      }
    };

    confirmPayment();
  }, [location, navigate]);

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
        <button onClick={() => navigate('/')}>Retour à l&apos;accueil</button>
      </div>
    </main>
  );
};

export default SuccessPage;
