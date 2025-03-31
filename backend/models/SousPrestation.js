const mongoose = require('mongoose');

const sousPrestationSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    longDescription: { type: String, required: true },
    profileImage: { type: String, required:true },  // URL de l'image pour le homepage
    backgroundImage: { type: String, required:true },  // URL de l'image pour le page 
    prestation: { type: mongoose.Schema.Types.ObjectId, ref: 'Prestation', required: true }, // Référence à la prestation
    prestataires: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prestataire' }]
}, { timestamps: true });

module.exports = mongoose.model('SousPrestation', sousPrestationSchema);
