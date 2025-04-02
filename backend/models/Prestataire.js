const mongoose = require("mongoose");

const PrestataireSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    profilePicture: { type: String, required: true },
    role: {
      type: String,
      enum: ["client", "admin", "prestataire"],
      default: "prestataire",
    },
    selectedPrestations: [
      {
        prestationId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Prestation",
        },
        selectedSousPrestations: [
          { type: mongoose.Schema.Types.ObjectId, ref: "SousPrestation" },
        ],
      },
    ],
    realisations: [{ type: String, required: false }],
  },
  { timestamps: true },
);

const Prestataire = mongoose.model("Prestataire", PrestataireSchema);
module.exports = Prestataire;
