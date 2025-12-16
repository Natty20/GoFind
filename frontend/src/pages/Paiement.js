import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import '../styles/Client/Paiement.css';

const stripePromise = loadStripe(
  'pk_test_51R7Ik7P4Z6DHCQ7IB69JezJ3USgHjhhSXWUGX3Bmbl8upZubm1r1Uto3SxF83QVOQhGddretaqdPwofwda35wXyg00s5ru1ZFW'
);

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    prestataire,
    client,
    selectedDate,
    selectedHour,
    prestations,
    montant,
    description,
  } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, type: '', message: '' });

  const handleStripePayment = async () => {
    setLoading(true);
    try {
      const stripe = await stripePromise;

      // Préparer les prestations pour le backend
      const payload = {
        montant,
        client,
        prestataire,
        prestations,
        selectedDate,
        selectedHour,
        description,
      };

      // 1️⃣ Création de session Stripe
      const { data } = await axios.post(
        'https://gofind-v9ee.onrender.com/api/stripe/create-checkout-session',
        payload
      );

      // 2️⃣ Redirection vers Stripe
      const result = await stripe.redirectToCheckout({ sessionId: data.id });

      if (result.error) {
        setModal({ open: true, type: 'error', message: result.error.message });
      }
    } catch (err) {
      console.error('Erreur paiement:', err);
      setModal({
        open: true,
        type: 'error',
        message: 'Erreur lors du paiement.',
      });
    }
    setLoading(false);
  };

  const handleCloseModal = () => {
    setModal({ open: false, type: '', message: '' });
    navigate('/profil'); // ou "/" si tu préfères l'accueil
  };

  return (
    <main className="payment-page">
      <div className="payment-container">
        <h1>Confirmez votre rendez-vous</h1>
        <p>
          Montant à régler : <strong>{montant}€</strong>
        </p>
        <button
          className="btn-secondary"
          onClick={handleStripePayment}
          disabled={loading}
        >
          {loading ? 'Paiement en cours...' : 'Payer avec Stripe'}
        </button>
      </div>

      {modal.open && (
        <div className={`modal ${modal.type}`}>
          <div className="modal-content">
            <h2>
              {modal.type === 'success' ? 'Paiement réussi 🎉' : 'Erreur ❌'}
            </h2>
            <p>{modal.message}</p>
            <button className="btn-primary" onClick={handleCloseModal}>
              OK
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default PaymentPage;
