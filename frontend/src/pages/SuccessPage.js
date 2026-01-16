import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Client/Success.css';

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [, setError] = useState(null);

  useEffect(() => {
    const sessionId = new URLSearchParams(location.search).get('session_id');

    if (!sessionId) return;

    axios
      .post('https://gofind-v9ee.onrender.com/api/stripe/confirm', {
        sessionId,
      })
      .catch(() => {
        setError(
          'Une erreur est survenue lors de la confirmation du paiement.'
        );
      });
  }, [location.search]);

  return (
    <main className="success-page">
      <section className="success-page-container">
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
      </section>
    </main>
  );
};

export default SuccessPage;
