import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    const params = new URLSearchParams(hash.split('?')[1]);
    const sessionId = params.get('session_id');

    if (!sessionId) {
      navigate('/cancel');
      return;
    }

    axios
      .post('https://gofind-v9ee.onrender.com/api/stripe/confirm-payment', {
        sessionId,
      })
      .then(() => {
        setTimeout(() => {
          navigate('/profil');
        }, 3000);
      })
      .catch(() => {
        navigate('/cancel');
      });
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
