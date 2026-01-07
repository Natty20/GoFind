const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const stripe = require("stripe")(
  process.env.STRIPE_PRIVATE_KEY || "sk_test_51R7Ik7P4Z6DHCQ7I5Pw29lolF97FzMkWeBYDj1FL9XwoVmbHmRXWiPAunHOkZcf0hjWKEEwFJ1fH8d1odZXOeHfK00u6T1CsJI"
);

const frontendURL = "https://go-find.vercel.app";

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

    if (!client || !prestataire || !prestations)
      return res.status(400).json({ error: "Données manquantes" });

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
      success_url: `${frontendURL}/#/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendURL}/#/cancel`,
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
    console.error("Erreur création session Stripe:", err);
    res.status(500).json({ error: "Impossible de créer la session Stripe" });
  }
});

// ============================
// SUCCESS → SAVE RESERVATION
// ============================
router.get("/success", async (req, res) => {
  try {
    const sessionId = req.query.session_id;
    if (!sessionId) return res.redirect(`${frontendURL}/#/cancel`);

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.redirect(`${frontendURL}/#/cancel`);
    }

    const prestations = JSON.parse(session.metadata.prestations || "[]");

    // Créer la réservation
    await Reservation.create({
      client: session.metadata.clientId,
      prestataire: session.metadata.prestataireId,
      prestations: prestations.map((p) => ({
        prestationId: p.prestationId,
        sousPrestations: p.selectedSousPrestations.map((sp) => sp.sousPrestationId),
      })),
      date: session.metadata.date,
      heure: session.metadata.heure,
      description: session.metadata.description,
      etat: "en attente",
      modePaiement: "Carte via Stripe",
    });

    // Redirection frontend
    return res.redirect(`${frontendURL}/#/success`);
  } catch (err) {
    console.error("Erreur lors du success Stripe:", err);
    return res.redirect(`${frontendURL}/#/cancel`);
  }
});

module.exports = router;
