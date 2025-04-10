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
const stripeRoutes = require("./routes/stripe");

connectDB();

const app = express();

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
  next();
});

// Définition des routes API
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/prestataires", prestataireRoutes);
app.use("/api/prestations", categorieRoutes);
app.use("/api/sousprestations", sousPrestationRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/stripe", stripeRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API pour le site en ligne is running...");
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
