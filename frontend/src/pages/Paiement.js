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

      const { data } = await axios.post(
        'http://149.202.53.181:2000/api/stripe/create-checkout-session',
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

  // const [selectedPayment, setSelectedPayment] = useState('');

  // console.log('Données reçues :', location.state);

  // const handlePaymentChange = (e) => {
  //   setSelectedPayment(e.target.value);
  // };

  // const handleConfirmPayment = async () => {
  //   if (!selectedPayment) {
  //     alert('Veuillez sélectionner un moyen de paiement !');
  //     return;
  //   }

  //   try {
  //     if (!Array.isArray(prestations)) {
  //       console.error(
  //         "'prestations' doit être un tableau valide",
  //         prestations
  //       );
  //       alert(
  //         'Erreur : les prestations ne sont pas valides. Veuillez réessayer.'
  //       );
  //       return;
  //     }

  //     // Créer un tableau pour les prestations et sous-prestations associées
  //     const selectedPrestations = prestations.map((prestation) => ({
  //       prestationId: prestation.prestationId,
  //       prestationNom: prestation.prestationNom,
  //       sousPrestations: Array.isArray(prestation.selectedSousPrestations)
  //         ? prestation.selectedSousPrestations.map(
  //             (sousPrestation) => sousPrestation.sousPrestationId
  //           ) // Envoie uniquement les IDs
  //         : [], // Si `selectedSousPrestations` est undefined, on met un tableau vide.
  //     }));

  //     // Données envoyées à l'API
  //     const reservationData = {
  //       clientId: client?._id,
  //       prestataireId: prestataire?._id,
  //       prestations: selectedPrestations, // Envoi des prestations avec les sous-prestations filtrées
  //       date: selectedDate,
  //       heure: selectedHour,
  //       modePaiement: selectedPayment,
  //       description: description || '',
  //     };

  //     console.log('Données envoyées:', reservationData);

  //     // Envoi de la requête POST
  //     await axios.post(
  //       'http://localhost:2000/api/reservations/new',
  //       reservationData
  //     );
  //     if (selectedPayment && montant && selectedDate) {
  //       navigate('/demande_envoye', {
  //         state: {
  //           client,
  //           prestataire,
  //           selectedPayment,
  //           montant,
  //           selectedDate,
  //         },
  //       });
  //     } else {
  //       alert('Problème avec la réservation. Vérifiez les informations.');
  //     }
  //   } catch (error) {
  //     console.error('Erreur lors du paiement :', error);
  //     alert('Une erreur est survenue. Veuillez réessayer.');
  //   }
  // };

  return (
    <div className="payment-page">
      <div className="note">
        <p>
          <strong>Note :</strong> Vous serez remboursé(e) de votre acompte si la
          prestation est annulée.
        </p>
      </div>

      <main className="payment-container">
        <h2>
          Sélectionnez Votre Moyen De Paiement Pour Confirmer Le Rendez-Vous
        </h2>
        {/* <div className="payment-options">
          {['Espèces', 'Chèque', 'PayPal', 'Virement Bancaire'].map(
            (method) => (
              <label key={method}>
                <input
                  type="radio"
                  name="payment"
                  value={method}
                  checked={selectedPayment === method}
                  onChange={handlePaymentChange}
                />
                {method}
              </label>
            )
          )}
        </div> */}

        <div className="amount-section">
          <p>Montant À Régler</p>
          <p className="total-amount">
            Total: <strong>{montant}€</strong>
          </p>
        </div>

        <button className="confirm-button" onClick={handleStripePayment}>
          {loading ? 'Paiement en cours...' : 'Confirmer et Payer'}
        </button>
      </main>
    </div>
  );
};

export default PaymentPage;
