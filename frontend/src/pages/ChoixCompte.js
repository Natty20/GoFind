import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MDBContainer } from 'mdb-react-ui-kit';
import '../styles/All/ChoixCompte.css';

const ChoixCompte = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleChoix = (type) => {
    if (type === 'client') {
      navigate('/login');
    } else if (type === 'prestataire') {
      navigate('/prestataire_login');
    }
  };

  return (
    <main className="choix-compte">
      <div className="choix-left-panel">
        <div className="welcome-text">
          <h1>GoFind ton plaisir près de chez toi</h1>
          <p>Veuillez choisir pour continuer :</p>
        </div>

        <div className="choix-boutons">
          <button
            onClick={() => handleChoix('client')}
            className="choix-btn client"
          >
            Je suis un Client
          </button>
          <button
            onClick={() => handleChoix('prestataire')}
            className="choix-btn prestataire"
          >
            Je suis un Prestataire
          </button>
        </div>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      </div>

      <div className="choix-right-panel">
        <div>
          <h4>Nous sommes plus qu’une entreprise</h4>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>
    </main>
  );
};

export default ChoixCompte;
