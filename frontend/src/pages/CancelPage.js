import React from 'react';
import { Link } from 'react-router-dom';

const CancelPage = () => {
  return (
    <div className="container">
      <h1 className="tittle">Votre Paiement à été annulé ❌</h1>
      <p className="message">
        Votre paiement n&apos;a pas été complété. Vous pouvez réessayer.
      </p>
      <Link to="/paiement" className="button">
        Réessayer
      </Link>
      <Link to="/" className="homeButton">
        Retour à l&apos;accueil
      </Link>
    </div>
  );
};

export default CancelPage;
