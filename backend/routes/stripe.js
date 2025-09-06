const express = require("express");
require("dotenv").config();
const axios = require("axios");

const router = express.Router();
const stripe = require("stripe")(
  "sk_test_51R7Ik7P4Z6DHCQ7I5Pw29lolF97FzMkWeBYDj1FL9XwoVmbHmRXWiPAunHOkZcf0hjWKEEwFJ1fH8d1odZXOeHfK00u6T1CsJI",
);

router.post("/create-checkout-session", async (req, res) => {
  console.log("Requête reçue pour Stripe :", req.body);
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
      success_url: `https://natty20.github.io/GoFind/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://natty20.github.io/GoFind/cancel`,
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
    console.error("Erreur Stripe:", error);
    res.status(500).send("Erreur lors de la création de la session Stripe");
  }
});

router.get("/confirm-payment", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.query.session_id,
    );

    if (session.payment_status === "paid") {
      const reservationData = {
        clientId: session.metadata.clientId,
        prestataireId: session.metadata.prestataireId,
        prestations: JSON.parse(session.metadata.prestations).map((p) => ({
          prestationId: p.prestationId,
          sousPrestations: p.selectedSousPrestations.map(
            (sp) => sp.sousPrestationId,
          ),
        })),
        date: session.metadata.date,
        heure: session.metadata.heure,
        modePaiement: "Carte via Stripe",
        description: session.metadata.description || "Pas de description",
      };

      await axios.post(
        "https://gofind-v9ee.onrender.com/api/reservations/new",
        reservationData,
      );

      return res.redirect(
        `https://natty20.github.io/GoFind/success?session_id=${req.query.session_id}`,
      );
    } else {
      return res.status(400).json({ error: "Paiement non validé." });
    }
  } catch (error) {
    console.error("Erreur confirmation Stripe :", error.message);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
