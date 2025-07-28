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
    origin: "https://natty20.github.io",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/prestataires", prestataireRoutes);
app.use("/api/prestations", categorieRoutes);
app.use("/api/sousprestations", sousPrestationRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/stripe", stripeRoutes);

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error("🔥 Erreur serveur :", err);
  res.status(500).json({ message: "Erreur interne du serveur" });
});

app.use(express.static(path.join(__dirname, "frontend", "build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
