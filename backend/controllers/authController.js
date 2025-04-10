const Client = require("../models/Client");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = async (req, res) => {
  try {
    const { nom, prenom, email, password, phone, address, profilePicture } =
      req.body;

    console.log("Données reçues:", req.body);

    // Vérifier si l'email est valide, et les champs obligatoires
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Veuillez entrer un email valide." });
    }
    if (!nom || !prenom || !email || !password || !phone) {
      return res
        .status(400)
        .json({ message: "Veuillez remplir tous les champs obligatoires." });
    }

    // Vérifier si l'email existe déjà et renforcer le mdp pour l'inscription
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({
        message: "Cet email est déjà utilisé. Connnectee-vous pour continuer",
      });
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Le mot de passe doit avooir au moins 6 caractères, une majuscule, minuscule et un caractère spécial.",
      });
    }

    // Hashage du mot de passe avec bcryptjs
    bcrypt.setRandomFallback((len) => crypto.randomBytes(len));
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newClient = new Client({
      nom,
      prenom,
      email,
      password: hashedPassword,
      phone,
      address,
      profilePicture,
    });
    await newClient.save();
    res.status(201).json({
      message:
        "Inscription réussie ! Connectez-vous pour profiter de nos services",
      client: newClient,
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    res.status(500).json({
      message: "Erreur serveur lors de votre inscription",
      error: error.message || error,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si le client existe et le mdp
    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(404).json({ message: "Client non trouvé" });
    }
    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    // Générer un token
    const token = jwt.sign(
      { id: client._id, role: client.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    res.status(200).json({
      message: "Connexion réussie, profitez de nos services!",
      token,
      client,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur serveur lors de votre connexion", error });
  }
};

const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();

    res.status(200).json({
      message: "Clients fetched successfully",
      clients,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({ message: "Client non trouvée" });
    }

    res.status(200).json({
      message: "Client récupérée avec succès",
      client,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du client :", error);
    res.status(500).json({ message: "Erreur serveur! c est impossible" });
  }
};

const updateClient = async (req, res) => {
  try {
    const { id } = req.params; // ID from URL parameter
    const { nom, prenom, email, phone, profilePicture, address } = req.body; // Data from request body

    const updatedClient = await Client.findByIdAndUpdate(
      id,
      {
        nom,
        prenom,
        email,
        phone,
        profilePicture,
        address,
      },
      { new: true },
    );

    if (!updatedClient) {
      return res.status(404).json({ message: "Compte non trouvé" });
    }

    res.status(200).json({
      message: "Les modifications on été prise en compte!",
      client: updatedClient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedClient = await Client.findByIdAndDelete(id);

    if (!deletedClient) {
      return res.status(404).json({ message: "Compte non trouvé" });
    }

    res.status(200).json({
      message: "Copmte supprimé avec succes!",
      client: deletedClient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  login,
  register,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
};
