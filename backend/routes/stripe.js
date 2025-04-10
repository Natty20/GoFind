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
      success_url: "https://gofind.cloud//success",
      cancel_url: "https://gofind.cloud//cancel",
      metadata: {
        clientId: String(client?._id),
        prestataireId: String(prestataire?._id),
        prestations: JSON.stringify(prestations),
        date: String(selectedDate),
        heure: String(selectedHour),
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
    console.log(
      "✅ [Stripe] Confirmation de paiement reçue ! Session ID :",
      req.query.session_id,
    );

    const session = await stripe.checkout.sessions.retrieve(
      req.query.session_id,
    );
    console.log("🔄 [Stripe] Détails de la session :", session);

    if (session.payment_status === "paid") {
      console.log(
        "💰 [Stripe] Paiement validé ! On enregistre la réservation...",
      );

      const reservationData = {
        clientId: session.metadata.clientId,
        prestataireId: session.metadata.prestataireId,
        prestations: JSON.parse(session.metadata.prestations).map((p) => ({
          prestationId: p.prestationId,
          sousPrestations:
            p.selectedSousPrestations.map((sp) => sp.sousPrestationId) || [],
        })),
        date: session.metadata.date,
        heure: session.metadata.heure,
        modePaiement: "Carte via Stripe",
        description: session.metadata.description || "Pas de description",
      };

      console.log(
        "📤 [Stripe] Envoi des données de réservation :",
        reservationData,
      );

      try {
        const response = await axios.post(
          "http://149.202.53.181:2000/api/reservations/new",
          reservationData,
        );
        console.log("Réservation enregistrée avec succès :", response.data);
      } catch (error) {
        console.error(
          "Erreur lors de l'enregistrement de la réservation :",
          error.response?.data || error.message,
        );
      }

      console.log("Redirection vers :", "https://gofind.cloud/success");
      return res.redirect("https://gofind.cloud/success");
    } else {
      console.error("Paiement non validé !");
      return res.redirect("https://gofind.cloud/cancel");
    }
  } catch (error) {
    console.error("Erreur de confirmation :", error.message);
    return res.redirect("https://gofind.cloud/cancel");
  }
});

module.exports = router;
