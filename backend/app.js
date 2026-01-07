const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const helmet = require("helmet");

// Routes
const adminRoutes = require("./routes/adminRoutes");
const categorieRoutes = require("./routes/categorieRoutes");
const sousPrestationRoutes = require("./routes/sousPrestationRoutes");
const authRoutes = require("./routes/authRoutes");
const prestataireRoutes = require("./routes/prestataireRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const stripeRoutes = require("./routes/stripe");
const uploadRoutes = require("./routes/uploadRoutes");
const citiesRoutes = require("./routes/citiesRoutes");
const searchRoutes = require("./routes/searchRoutes");

connectDB();

const app = express();

/* =======================
   SECURITY (HELMET)
======================= */
app.use(
  helmet({
    crossOriginEmbedderPolicy: false, // Stripe
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
        scriptSrcElem: ["'self'", "https://js.stripe.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
        styleSrcElem: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "https://res.cloudinary.com",
          "https://cdn.pixabay.com",
        ],
        connectSrc: [
          "'self'",
          "https://gofind-v9ee.onrender.com",
          "https://api.cloudinary.com",
          "https://api.stripe.com",
          "https://js.stripe.com",
        ],
        frameSrc: ["https://js.stripe.com"],
        fontSrc: ["'self'", "https://cdnjs.cloudflare.com", "data:"],
      },
    },
  })
);

/* =======================
   CORS (CRITIQUE)
======================= */
const allowedOrigins = [
  "https://go-find.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // autorise Postman / Render / cron
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("❌ CORS bloqué pour :", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" })
);

app.options("*", cors());


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
app.use("/api/upload", uploadRoutes);
app.use("/api/cities", citiesRoutes);
app.use("/api/search", searchRoutes);


app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      message: "Image trop lourde (max 5 Mo)",
    });
  }
  next(err);
});

/* =======================
   GLOBAL ERROR HANDLER
======================= */
app.use((err, req, res, next) => {
  console.error("🔥 Erreur serveur :", err);
  res.status(500).json({ message: "Erreur interne du serveur" });
});

/* =======================
   SERVER
======================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
