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
      const stripe = await stripePromise;

      const selectedPrestations = prestations.map((prestation) => ({
        prestationId: prestation.prestationId,
        selectedSousPrestations: prestation.selectedSousPrestations.map(
          (sous) => ({
            sousPrestationId: sous.sousPrestationId,
          })
        ),
      }));

      const payload = {
        montant,
        client,
        prestataire,
        prestations: selectedPrestations,
        selectedDate,
        selectedHour,
        description,
      };

      console.log('📤 Données envoyées à Stripe:', payload);

      const { data } = await axios.post(
        'https://gofind-v9ee.onrender.com/api/stripe/create-checkout-session',
        payload
      );

      // 👉 Redirection vers Stripe Checkout
      const result = await stripe.redirectToCheckout({ sessionId: data.id });

      if (result.error) {
        console.error('❌ Erreur Stripe:', result.error.message);
      }
    } catch (error) {
      console.error('❌ Erreur lors du paiement:', error);
    }
    setLoading(false);
  };

  return (
    <main className="payment-page">
      <div className="note">
        <p>
          <strong>Note :</strong> Vous serez remboursé(e) de votre acompte si la
          prestation est annulée par le(a) prestataire.
        </p>
      </div>

      <section className="payment-container">
        <h1>
          Pour Confirmer votre Rendez-Vous, vous devez payer une acompte enfin
          de confirmer votre choix
        </h1>

        <div className="amount-section">
          <p></p>
          <p className="total-amount">
            Montant À Régler: <strong>{montant}€</strong>
          </p>
        </div>

        <button className="btn-secondary" onClick={handleStripePayment}>
          {loading ? 'Paiement en cours...' : 'Payer avec Stripe'}
        </button>
      </section>
    </main>
  );
};

export default PaymentPage;
