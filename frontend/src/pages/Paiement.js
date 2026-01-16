import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import '../styles/Client/Paiement.css';

const stripePromise = loadStripe(
  'pk_test_51R7Ik7P4Z6DHCQ7IB69JezJ3USgHjhhSXWUGX3Bmbl8upZubm1r1Uto3SxF83QVOQhGddretaqdPwofwda35wXyg00s5ru1ZFW'
);

const PaymentPage = () => {
  const location = useLocation();
  const [, setError] = useState(null);
  // const navigate = useNavigate();
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
    try {
      setLoading(true);

      const { data } = await axios.post(
        'https://gofind-v9ee.onrender.com/api/stripe/create-checkout-session',
        {
          montant,
          client,
          prestataire,
          prestations,
          selectedDate,
          selectedHour,
          description,
        }
      );

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: data.id });
    } catch (err) {
      setError('Erreur lors du paiement complète:', err.response || err);
      alert(err.response?.data?.message || 'Erreur lors du paiement');
      setLoading(false);
    }
  };

  return (
    <main className="payment-page">
      <section className="payment-container">
        <h1 className="note">
          Pour Confirme votre rendez-vous, vous devez payer une acompte qui ne
          sera pas remboursé une fois la réservation annulé
        </h1>
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
      </section>
    </main>
  );
};

export default PaymentPage;
