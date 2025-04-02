const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");

// Import des routes
const adminRoutes = require("./routes/adminRoutes");
const categorieRoutes = require("./routes/categorieRoutes");
const sousPrestationRoutes = require("./routes/sousPrestationRoutes");
const authRoutes = require("./routes/authRoutes");
const prestataireRoutes = require("./routes/prestataireRoutes");
const reservationRoutes = require("./routes/reservationRoutes");

connectDB();

const app = express();

// Middleware CORS
app.use(
  cors({
    origin: "https://gofind.cloud", // Autorise les requêtes du frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Middlewares JSON & Logging
app.use(express.json());
app.use((req, res, next) => {
  // console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// Définition des routes API
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/prestataires", prestataireRoutes);
app.use("/api/prestations", categorieRoutes);
app.use("/api/sousprestations", sousPrestationRoutes);
app.use("/api/reservations", reservationRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("✅ API pour le site en ligne is running...");
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error("🔥 Erreur serveur :", err);
  res.status(500).json({ message: "Erreur interne du serveur" });
});

// Gestion des routes frontend pour les applications React (si nécessaire)
app.use(express.static(path.join(__dirname, "frontend", "build")));

// Redirige toutes les autres requêtes vers le fichier index.html pour un SPA
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
});

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// app.post('/api/create-checkout-session', async (req, res) => {
//     try {
//         const { montant, client, prestataire, prestations, selectedDate, selectedHour } = req.body;

//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ['card'],
//             line_items: [{
//                 price_data: {
//                     currency: 'eur',
//                     product_data: { name: 'Paiement Service' },
//                     unit_amount: montant * 100,
//                 },
//                 quantity: 1,
//             }],
//             mode: 'payment',
//             success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
//             cancel_url: 'http://localhost:3000/cancel',
//             metadata: {
//                 clientId: client?._id,
//                 prestataireId: prestataire?._id,
//                 prestations: JSON.stringify(prestations),
//                 date: selectedDate,
//                 heure: selectedHour,
//             },
//         });

//         res.json({ id: session.id });
//     } catch (error) {
//         console.error('Erreur Stripe:', error);
//         res.status(500).send('Erreur lors de la création de la session Stripe');
//     }
// });

// app.get('/api/confirm-payment', async (req, res) => {
//     try {
//         const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

//         if (session.payment_status === 'paid') {
//             const reservationData = {
//                 clientId: session.metadata.clientId,
//                 prestataireId: session.metadata.prestataireId,
//                 prestations: JSON.parse(session.metadata.prestations),
//                 date: session.metadata.date,
//                 heure: session.metadata.heure,
//                 modePaiement: 'Carte via Stripe',
//                 description: '',
//             };

//             await axios.post('http://localhost:2000/api/reservations/new', reservationData);

//             return res.redirect('http://localhost:3000/demande_envoye');
//         } else {
//             return res.redirect('http://localhost:3000/cancel');
//         }
//     } catch (error) {
//         console.error('Erreur de confirmation:', error);
//         res.redirect('http://localhost:3000/cancel');
//     }
// });
