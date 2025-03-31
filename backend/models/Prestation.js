const mongoose = require('mongoose');

const prestationSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    shortDescription: { type: String, required: true },
    longDescription: { type: String, required: true },
    overlayDescription: { type: String},
    profileImage: { type: String, required: true },  
    backgroundImage:{ type:String, required:true}, 
    overlayImage: { type: String },
    sousPrestations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SousPrestation' }]
}, { timestamps: true });

module.exports = mongoose.model('Prestation', prestationSchema);
