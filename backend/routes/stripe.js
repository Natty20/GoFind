const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const stripe = require("stripe")(
  "sk_test_51R7Ik7P4Z6DHCQ7I5Pw29lolF97FzMkWeBYDj1FL9XwoVmbHmRXWiPAunHOkZcf0hjWKEEwFJ1fH8d1odZXOeHfK00u6T1CsJI"
);

// ============================
// 1️⃣ CREATE CHECKOUT SESSION
// ============================
router.post("/create-checkout-session", async (req, res) => {
  try {
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
      success_url: "https://natty20.github.io/GoFind/#/success",
      cancel_url: "https://natty20.github.io/GoFind/#/cancel",

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
    console.error("❌ Stripe error:", err.message);
    res.status(500).json({ error: "Stripe session error" });
  }
});

// ============================
// 2️⃣ CONFIRM PAYMENT
// ============================
router.post("/confirm-payment", async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Paiement non confirmé" });
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
      modePaiement: "Stripe",
    });

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur paiement" });
  }
});


module.exports = router;
