const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const stripe = require("stripe")("sk_test_51R7Ik7P4Z6DHCQ7I5Pw29lolF97FzMkWeBYDj1FL9XwoVmbHmRXWiPAunHOkZcf0hjWKEEwFJ1fH8d1odZXOeHfK00u6T1CsJI");

// Créer la session Stripe
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { montant, client, prestataire, prestations, selectedDate, selectedHour, description } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: "Acompte rendez-vous" },
            unit_amount: montant * 100,
          },
          quantity: 1,
        },
      ],
      success_url: req.body.success_url || "https://natty20.github.io/GoFind/",
      cancel_url: req.body.cancel_url || "https://natty20.github.io/GoFind/",
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

  } catch (err) {
    console.error("Stripe session error:", err);
    res.status(500).json({ error: "Stripe session error" });
  }
});

// Webhook Stripe pour créer la réservation après paiement
router.post("/webhook", express.raw({ type: 'application/json' }), async (req, res) => {
  let event;
  try {
    const sig = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(req.body, sig, "YOUR_ENDPOINT_SECRET");
  } catch (err) {
    console.log('Webhook signature mismatch:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const prestations = JSON.parse(session.metadata.prestations);

    const reservation = new Reservation({
      client: session.metadata.clientId,
      prestataire: session.metadata.prestataireId,
      prestations: prestations.map(p => ({
        prestationId: p.prestationId,
        sousPrestations: p.selectedSousPrestations.map(sp => sp.sousPrestationId)
      })),
      date: session.metadata.date,
      heure: session.metadata.heure,
      description: session.metadata.description,
      etat: "en attente",
      modePaiement: "Stripe"
    });

    await reservation.save();
  }

  res.json({ received: true });
});

module.exports = router;
