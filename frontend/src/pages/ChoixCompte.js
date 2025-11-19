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
          <img
            src={`${process.env.PUBLIC_URL}/images/GF-logo.png`}
            alt="GoFind - Plateforme de mise en relation entre clients et prestataires"
          />
          <h1 className="tittles">GoFind ton plaisir près de chez toi</h1>
          <p>Veuillez choisir pour continuer :</p>
        </div>

        <div className="choix-boutons">
          <button onClick={() => handleChoix('client')} className="btn-primary">
            Je suis un Client
          </button>
          <button
            onClick={() => handleChoix('prestataire')}
            className="btn-secondary"
          >
            Je suis un Prestataire
          </button>
        </div>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      </div>

      <div className="choix-right-panel">
        <div>
          <h2>Nous sommes plus qu’une simple entreprise</h2>
          <p>
            Nous construisons des relations durables basées sur la confiance,
            l’innovation et l’humain. Notre mission va bien au-delà d’un simple
            service : nous créons de la valeur pour chaque personne que nous
            accompagnons.
          </p>

          <button
            className="btn-primary"
            onClick={() => navigate('/login_admin')}
          >
            Admin login
          </button>
        </div>
      </div>
    </main>
  );
};

export default ChoixCompte;
