const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const stripe = require("stripe")(
  "sk_test_51R7Ik7P4Z6DHCQ7I5Pw29lolF97FzMkWeBYDj1FL9XwoVmbHmRXWiPAunHOkZcf0hjWKEEwFJ1fH8d1odZXOeHfK00u6T1CsJI"
);

// ============================
// CREATE CHECKOUT SESSION
// ============================
const frontendURL = "https://gofind-v9ee.onrender.com";
router.post("/create-checkout-session", async (req, res) => {
  const {
    montant,
    client,
    prestataire,
    prestations,
    selectedDate,
    selectedHour,
    description,
  } = req.body;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: { name: "Paiement service" },
          unit_amount: montant * 100,
        },
        quantity: 1,
      },
    ],
    success_url: `${frontendURL}/api/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${frontendURL}/#/cancel`, // ou simplement /cancel si tu gères via React Router
    metadata: {
      clientId: client._id,
      prestataireId: prestataire._id,
      prestations: JSON.stringify(prestations),
      date: selectedDate,
      heure: selectedHour,
      description: description || "",
    },
  });


  res.json({ id: session.id });
});

// ============================
// STRIPE SUCCESS → SAVE + REDIRECT
// ============================
router.get("/success", async (req, res) => {
  try {
    const sessionId = req.query.session_id;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.redirect(`${frontendURL}/#/cancel`);
    }

    const prestations = JSON.parse(session.metadata.prestations);

    await Reservation.create({
      client: session.metadata.clientId,
      prestataire: session.metadata.prestataireId,
      prestations: prestations.map(p => ({
        prestationId: p.prestationId,
        sousPrestations: p.selectedSousPrestations.map(
          sp => sp.sousPrestationId
        ),
      })),
      date: session.metadata.date,
      heure: session.metadata.heure,
      description: session.metadata.description,
      etat: "en attente",
      modePaiement: "Carte via Stripe",
    });

    return res.redirect(`${frontendURL}/#/success`);
  } catch (err) {
    console.error(err);
    return res.redirect(`${frontendURL}/#/cancel`);
  }
});


module.exports = router;
