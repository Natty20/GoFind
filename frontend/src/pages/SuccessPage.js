import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Client/Success.css';

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const sessionId = new URLSearchParams(location.search).get('session_id');

    if (!sessionId) return;

    axios
      .post('https://gofind-v9ee.onrender.com/api/stripe/confirm', {
        sessionId,
      })
      .catch((err) => {
        console.error('Erreur confirmation paiement:', err);
      });
  }, [location.search]);

  return (
    <main className="success-page">
      <div className="success-page-container">
        <div className="icon">
          <div className="circle">
            <span>&#10004;</span>
          </div>
        </div>

        <div className="message">
          <h2>Paiement réussi ! 🎉</h2>
          <p>Votre demande de rendez-vous a été envoyée au prestataire.</p>

          <button
            className="btn-primary"
            onClick={() => navigate('/prestation')}
          >
            Voir Nos Prestations
          </button>
          <button className="btn-secondary" onClick={() => navigate('/')}>
            Retour à l&apos;accueil
          </button>
        </div>
      </div>
    </main>
  );
};

export default SuccessPage;
