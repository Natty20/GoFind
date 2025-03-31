import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionId = new URLSearchParams(location.search).get('session_id');

  useEffect(() => {
    if (sessionId) {
      axios
        .get(
          `http://localhost:2000/api/confirm-payment?session_id=${sessionId}`
        )
        .catch((error) => {
          console.error('Erreur de confirmation:', error);
          navigate('/cancel');
        });
    }
  }, [sessionId, navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1 style={{ color: 'green' }}>Paiement réussi ✅</h1>
      <p>Redirection en cours...</p>
    </div>
  );
};

export default SuccessPage;
