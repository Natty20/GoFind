const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    prestataire: { type: mongoose.Schema.Types.ObjectId, ref: "Prestataire", required: true },
    prestations: [
        {
            prestationId: { type: mongoose.Schema.Types.ObjectId, ref: "Prestation", required: true },
            sousPrestations: [{ type: mongoose.Schema.Types.ObjectId, ref: "SousPrestation", required: true }]
        }
    ],
    date: { type: Date, required: true },
    heure: { type: String, required: true },
    modePaiement: { type: String, enum: ["Especes", "Cheque", "PayPal", "Virement Bancaire"], required: true },
    etat: { type: String, enum: ["en attente", "acceptée", "déclinée"], default: "en attente" },
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Reservation", reservationSchema);
