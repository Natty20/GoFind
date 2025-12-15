// backend/routes/stripe.js
const express = require("express");
require("dotenv").config();
const axios = require("axios");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // mets ta clé secrète dans .env

// 👉 Création session Stripe
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
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: "Paiement Service" },
            unit_amount: montant * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",

      // ✅ Redirection frontend avec session_id
      success_url: `https://natty20.github.io/GoFind/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://natty20.github.io/GoFind/cancel?session_id={CHECKOUT_SESSION_ID}`,

      metadata: {
        clientId: String(client?._id),
        prestataireId: String(prestataire?._id),
        prestations: JSON.stringify(prestations),
        date: String(selectedDate),
        heure: String(selectedHour),
        description: description || "Pas de description",
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("❌ Erreur Stripe:", error);
    res.status(500).send("Erreur lors de la création de la session Stripe");
  }
});

// 👉 Confirmation du paiement
router.post("/confirm-payment", async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ message: "sessionId manquant" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Paiement non validé" });
    }

    console.log("✅ Paiement confirmé :", session.id);

    const prestations = JSON.parse(session.metadata.prestations);

    const reservationData = {
      clientId: session.metadata.clientId,
      prestataireId: session.metadata.prestataireId,
      prestations: prestations.map((p) => ({
        prestationId: p.prestationId,
        sousPrestations: p.selectedSousPrestations.map(
          (sp) => sp.sousPrestationId
        ),
      })),
      date: session.metadata.date,
      heure: session.metadata.heure,
      modePaiement: "Carte via Stripe",
      description: session.metadata.description || "Pas de description",
    };

    // 🔥 Sauvegarde dans ta BDD
    await axios.post(
      "https://gofind-v9ee.onrender.com/api/reservations/new",
      reservationData
    );

    return res.status(200).json({
      success: true,
      reservation: reservationData,
    });
  } catch (error) {
    console.error("❌ Erreur confirmation Stripe :", error.message);
    return res.status(500).json({ message: "Erreur Stripe" });
  }
});

module.exports = router;
