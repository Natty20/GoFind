const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Reservation = require("../models/Reservation"); // adapte selon ton projet
const bodyParser = require("body-parser");

// --------------------------
// 1️⃣ Création de session Stripe
// --------------------------
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { montant, client, prestataire, prestations, selectedDate, selectedHour, description } = req.body;

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
      success_url: "https://natty20.github.io/GoFind/#/success",
      cancel_url: "https://natty20.github.io/GoFind/#/cancel",
      metadata: {
        clientId: String(client._id),
        prestataireId: String(prestataire._id),
        prestations: JSON.stringify(prestations),
        date: String(selectedDate),
        heure: String(selectedHour),
        description: description || "Pas de description",
      },
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error("❌ Erreur création session Stripe:", err.message);
    res.status(500).send("Erreur création session Stripe");
  }
});

// --------------------------
// 2️⃣ Webhook Stripe pour confirmer le paiement
// --------------------------
router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.log("⚠️ Signature webhook invalide:", err.message);
      return res.sendStatus(400);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      try {
        const prestations = JSON.parse(session.metadata.prestations);

        await Reservation.create({
          client: session.metadata.clientId,
          prestataire: session.metadata.prestataireId,
          prestations: prestations.map((p) => ({
            prestationId: p.prestationId,
            sousPrestations: p.selectedSousPrestations.map((sp) => sp.sousPrestationId),
          })),
          date: session.metadata.date,
          heure: session.metadata.heure,
          modePaiement: "Carte via Stripe",
          description: session.metadata.description || "Pas de description",
          etat: "en attente",
        });

        console.log("✅ Réservation sauvegardée !");
      } catch (err) {
        console.error("❌ Erreur création réservation:", err.message);
      }
    }

    res.sendStatus(200);
  }
);

module.exports = router;
