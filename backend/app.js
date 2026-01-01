const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");
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

connectDB();

const app = express();

/* ===SECURITY / CSP (HELMET)=== */
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        scriptSrc: [
          "'self'",
          "https://js.stripe.com",
        ],

        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdnjs.cloudflare.com",
        ],

        fontSrc: [
          "'self'",
          "https://cdnjs.cloudflare.com",
        ],

        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "https://res.cloudinary.com",
        ],

        connectSrc: [
          "'self'",
          "https://gofind-v9ee.onrender.com",
          "https://api.cloudinary.com",
          "https://api.stripe.com",
          "https://js.stripe.com",
        ],

        frameSrc: [
          "https://js.stripe.com",
        ],
      },
    },
  })
);
// Github pages
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

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// logs
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// routes api
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/prestataires", prestataireRoutes);
app.use("/api/prestations", categorieRoutes);
app.use("/api/sousprestations", sousPrestationRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/cities", citiesRoutes);

// error pour uploads
app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      message: "Image trop lourde (max 5 Mo)",
    });
  }
  next(err);
});

// build front
app.use(express.static(path.join(__dirname, "frontend", "build")));

app.get("*", (req, res) => {
  res.sendFile(
    path.resolve(__dirname, "frontend", "build", "index.html")
  );
});

// global error handling
app.use((err, req, res, next) => {
  console.error("🔥 Erreur serveur :", err);
  res.status(500).json({ message: "Erreur interne du serveur" });
});

// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
