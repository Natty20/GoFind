const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = async (req, res) => {
    try {
        const { nom, prenom, email, password, phone } = req.body;
        //email est valide et chapms obligatoires
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Veuillez entrer un email valide." });
        }
        if (!nom || !prenom || !email || !password || !phone) {
            return res.status(400).json({ message: "Veuillez remplir tous les champs obligatoires." });
        }

        // voir si l email existe déjà et exiger mdp
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Cet email est déjà utilisé. Connnectee-vous pour continuer" });
        }
        // renforcer le mdp pour chaque inscription et hasher le mdp
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Le mot de passe doit contenir au moins 6 caractères, une majuscule, une minuscule et un caractère spécial."
            });
        }
        
        bcrypt.setRandomFallback((len) => crypto.randomBytes(len));
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new Admin({
            nom,
            prenom,
            email,
            password: hashedPassword,
            phone
        }); await newAdmin.save();
        res.status(201).json({ message: "Inscription réussie ! Connectez-vous pour continuer", admin: newAdmin });

    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        res.status(500).json({
            message: "Erreur serveur lors de votre inscription",
            error: error.message || error
        });
    }
};

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifier si le client existe déjà puis générer un token
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "L'utilisateur non trouvé" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mot de passe incorrect" });
        }

        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({ message: "Connexion réussie, Connectez-vous pour gérer le site!", token, admin });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur lors de votre connexion", error });
    }
};

const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedAdmin = await Admin.findByIdAndDelete(id);

        if (!deletedAdmin) {
            return res.status(404).json({ message: 'Compte non trouvé' });
        }

        res.status(200).json({
            message: 'Copmte supprimé avec succes!',
            admin: deletedAdmin
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find().select("-password");
        res.status(200).json({ message: "Admins récupérés avec succès", admins });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};


module.exports = {
    login, 
    register,
    getAllAdmins,
    deleteAdmin
}