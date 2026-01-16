import React from 'react';
import { Link } from 'react-router-dom';

const CancelPage = () => {
  return (
    <main className="container">
      <h1 className="tittle">Votre Paiement à été annulé ❌</h1>
      <p className="message">
        Votre paiement n&apos;a pas été complété. Vous pouvez réessayer.
      </p>
      <Link to="/paiement" className="btn-primary">
        Réessayer
      </Link>
      <Link to="/" className="btn-secondary">
        Retour à l&apos;accueil
      </Link>
    </main>
  );
};

export default CancelPage;
