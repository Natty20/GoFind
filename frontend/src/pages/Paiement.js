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

  const handleStripePayment = async () => {
    setLoading(true);

    try {
      const { data } = await axios.post(
        '/api/stripe/create-checkout-session',
        payload
      );

      // 🔥 ON SAUVEGARDE AVANT STRIPE
      await axios.post('/api/stripe/confirm-payment', {
        sessionId: data.id,
      });

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: data.id });
    } catch (err) {
      console.error(err);
      alert('Paiement échoué');
    }

    setLoading(false);
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
    </main>
  );
};

export default PaymentPage;
