const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");

const stripeRoutes = require("./routes/stripe");

// Routes
const adminRoutes = require("./routes/adminRoutes");
const categorieRoutes = require("./routes/categorieRoutes");
const sousPrestationRoutes = require("./routes/sousPrestationRoutes");
const authRoutes = require("./routes/authRoutes");
const prestataireRoutes = require("./routes/prestataireRoutes");
const reservationRoutes = require("./routes/reservationRoutes");

connectDB();

const app = express();

app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeRoutes
);


const allowedOrigins = [
  "https://natty20.github.io",
  "https://natty20.github.io/GoFind",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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


app.use(express.static(path.join(__dirname, "frontend", "build")));

app.get("*", (req, res) => {
  res.sendFile(
    path.resolve(__dirname, "frontend", "build", "index.html")
  );
});


app.use((err, req, res, next) => {
  console.error("🔥 Erreur serveur :", err);
  res.status(500).json({ message: "Erreur interne du serveur" });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
