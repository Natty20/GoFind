const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required:true },
    role: { type:String, enum:["client", "admin", "prestataire"], default:"admin" },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Admin', AdminSchema);