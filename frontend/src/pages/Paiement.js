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
      const stripe = await stripePromise;

      // 🔄 Reformater les prestations pour backend
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

      const result = await stripe.redirectToCheckout({ sessionId: data.id });

      if (result.error) {
        console.error('Erreur Stripe:', result.error);
        navigate('/cancel');
      }
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      navigate('/cancel');
    }
    setLoading(false);
  };

  return (
    <div className="payment-page">
      <div className="note">
        <p>
          <strong>Note :</strong> Vous serez remboursé(e) de votre acompte si la
          prestation est annulée.
        </p>
      </div>

      <main className="payment-container">
        <h1>
          Sélectionnez Votre Moyen De Paiement Pour Confirmer Le Rendez-Vous
        </h1>

        <div className="amount-section">
          <p>Montant À Régler</p>
          <p className="total-amount">
            Total: <strong>{montant}€</strong>
          </p>
        </div>

        <button className="confirm-button" onClick={handleStripePayment}>
          {loading ? 'Paiement en cours...' : 'Payer avec Stripe'}
        </button>
      </main>
    </div>
  );
};

export default PaymentPage;
