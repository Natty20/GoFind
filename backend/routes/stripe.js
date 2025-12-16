// const express = require("express");
// const router = express.Router();
// // const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
// const Reservation = require("../models/Reservation"); // adapte selon ton projet
// const bodyParser = require("body-parser");
// const stripe = require("stripe")("sk_test_51R7Ik7P4Z6DHCQ7I5Pw29lolF97FzMkWeBYDj1FL9XwoVmbHmRXWiPAunHOkZcf0hjWKEEwFJ1fH8d1odZXOeHfK00u6T1CsJI");

// // --------------------------
// // 1️⃣ Création de session Stripe
// // --------------------------
// router.post("/create-checkout-session", async (req, res) => {
//   console.log("📥 Requête reçue pour Stripe :", req.body);
//   try {
//     const { montant, client, prestataire, prestations, selectedDate, selectedHour, description } = req.body;

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "eur",
//             product_data: { name: "Paiement Service" },
//             unit_amount: montant * 100,
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: "https://natty20.github.io/GoFind/#/success",
//       cancel_url: "https://natty20.github.io/GoFind/#/cancel",
//       metadata: {
//         clientId: String(client._id),
//         prestataireId: String(prestataire._id),
//         prestations: JSON.stringify(prestations),
//         date: String(selectedDate),
//         heure: String(selectedHour),
//         description: description || "Pas de description",
//       },
//     });

//     res.json({ id: session.id });
//   } catch (err) {
//     console.error("❌ Erreur création session Stripe:", err.message);
//     res.status(500).send("Erreur création session Stripe");
//   }
// });

// // --------------------------
// // 2️⃣ Webhook Stripe pour confirmer le paiement
// // --------------------------
// // 

// router.post("/confirm-payment", async (req, res) => { try { const { sessionId } = req.body; if (!sessionId) { return res.status(400).json({ message: "sessionId manquant" }); } const session = await stripe.checkout.sessions.retrieve(sessionId); if (session.payment_status !== "paid") { return res.status(400).json({ message: "Paiement non validé" }); }
//   console.log("✅ Paiement confirmé :", session.id); const prestations = JSON.parse(session.metadata.prestations); const reservationData = { clientId: session.metadata.clientId, prestataireId: session.metadata.prestataireId, prestations: prestations.map((p) => ({ prestationId: p.prestationId, sousPrestations: p.selectedSousPrestations.map((sp) => sp.sousPrestationId), })),
//     date: session.metadata.date, heure: session.metadata.heure, modePaiement: "Carte via Stripe", description: session.metadata.description || "Pas de description",
//   }; await axios.post("https://gofind-v9ee.onrender.com/api/reservations/new", reservationData); return res.status(200).json({ success: true, reservation: reservationData, });
// } catch (error) { console.error("❌ Erreur confirmation Stripe :", error.message); return res.status(500).json({ message: "Erreur Stripe" }); }
// }); module.exports = router;



const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const Reservation = require("../models/Reservation");

const stripe = require("stripe")("sk_test_51R7Ik7P4Z6DHCQ7I5Pw29lolF97FzMkWeBYDj1FL9XwoVmbHmRXWiPAunHOkZcf0hjWKEEwFJ1fH8d1odZXOeHfK00u6T1CsJI");

router.post("/create-checkout-session", async (req, res) => {
  const { montant, client, prestataire, prestations, selectedDate, selectedHour, description } = req.body;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: "eur",
        product_data: { name: "Acompte réservation" },
        unit_amount: montant * 100,
      },
      quantity: 1,
    }],
    success_url: "https://natty20.github.io/GoFind/#/success",
    cancel_url: "https://natty20.github.io/GoFind/#/cancel",
    metadata: {
      clientId: client._id,
      prestataireId: prestataire._id,
      prestations: JSON.stringify(prestations),
      date: selectedDate,
      heure: selectedHour,
      description,
    },
  });

  res.json({ id: session.id });
});

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.sendStatus(400);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      await Reservation.create({
        client: session.metadata.clientId,
        prestataire: session.metadata.prestataireId,
        prestations: JSON.parse(session.metadata.prestations),
        date: session.metadata.date,
        heure: session.metadata.heure,
        description: session.metadata.description,
        modePaiement: "Carte (Stripe)",
        etat: "en attente",
      });
    }

    res.json({ received: true });
  }
);

module.exports = router;
