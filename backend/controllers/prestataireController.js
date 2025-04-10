const Prestataire = require("../models/Prestataire");
const Prestation = require("../models/Prestation");
const SousPrestation = require("../models/SousPrestation");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const register = async (req, res) => {
  try {
    const {
      nom,
      email,
      password,
      phone,
      address,
      profilePicture,
      selectedPrestations,
    } = req.body;

    // Vérification si l'email existe déjà
    const existingPrestataire = await Prestataire.findOne({ email });
    if (existingPrestataire) {
      return res.status(400).json({
        message:
          "Cet email est déjà utilisé. veuillez vous connecter pour continuer",
      });
    }

    // Vérifier si l'email est valide, renforcer le mdp et le hasher
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Veuillez entrer un email valide." });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Le mot de passe doit contenir au moins 6 caractères, une majuscule, une minuscule et un caractère spécial.",
      });
    }

    bcrypt.setRandomFallback((len) => crypto.randomBytes(len));
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // parser selectedPrestations si c'est en json puis verifier les presta et sous presta
    let prestationsArray;
    if (typeof selectedPrestations === "string") {
      try {
        prestationsArray = JSON.parse(selectedPrestations);
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Erreur dans le format de selectedPrestations" });
      }
    } else {
      prestationsArray = selectedPrestations;
    }

    for (let prestation of prestationsArray) {
      const prestationExists = await Prestation.findById(
        prestation.prestationId,
      );
      if (!prestationExists) {
        return res.status(400).json({
          message: `Prestation ID ${prestation.prestationId} non trouvée.`,
        });
      }
      for (let sousPrestationId of prestation.selectedSousPrestations) {
        const sousPrestationExists =
          await SousPrestation.findById(sousPrestationId);
        if (!sousPrestationExists) {
          return res.status(400).json({
            message: `Sous-prestation ID ${sousPrestationId} non trouvée.`,
          });
        }
      }
    }

    // si tous se passe bien alors on crée le nouveau compte
    const newPrestataire = new Prestataire({
      nom,
      email,
      password: hashedPassword,
      phone,
      address,
      profilePicture,
      selectedPrestations: prestationsArray, // Bien sauvegarder sous forme de tableau
    });
    await newPrestataire.save();

    // lier le prestataire aux sous-prestations qu'ils ont choisi
    for (let prestation of prestationsArray) {
      for (let sousPrestationId of prestation.selectedSousPrestations) {
        await SousPrestation.findByIdAndUpdate(sousPrestationId, {
          $push: { prestataires: newPrestataire._id },
        });
      }
    }
    res.status(201).json({
      message: "Prestataire créé avec succès !",
      prestataire: newPrestataire,
    });
  } catch (err) {
    console.error("Erreur lors de la création du prestataire:", err);
    res.status(500).json({
      message: "Erreur lors de la création du prestataire",
      error: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const prestataire = await Prestataire.findOne({ email });

    if (!prestataire) {
      return res
        .status(400)
        .json({ message: "email ou mot de passe incorrect." });
    }

    const isMatch = await bcrypt.compare(password, prestataire.password);
    if (!isMatch) {
      return res.status(400).json({ message: "mot de passe incorrect." });
    }

    const token = jwt.sign(
      { id: prestataire._id, role: prestataire.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.status(200).json({ message: "Connexion réussie", token, prestataire });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

const getAllPrestataires = async (req, res) => {
  try {
    const prestataires = await Prestataire.find().select("-password");
    res
      .status(200)
      .json({ message: "Prestataires récupérés avec succès", prestataires });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

const getPrestataireById = async (req, res) => {
  try {
    const { id } = req.params;
    const prestataire = await Prestataire.findById(id);

    if (!prestataire) {
      return res.status(404).json({ message: "Prestataires non trouvée" });
    }

    res.status(200).json({
      message: "Prestataires récupérée avec succès",
      prestataire,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des Prestataires :", error);
    res.status(500).json({ message: "Erreur serveur! c est impossible" });
  }
};

const updatePrestataire = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, email, password, phone, address, profilePicture } = req.body;
    let updatedFields = { nom, email, phone, address, profilePicture };

    if (password) {
      updatedFields.password = await bcrypt.hash(password, 10);
    }

    const updatedPrestataire = await Prestataire.findByIdAndUpdate(
      id,
      updatedFields,
      { new: true },
    ).select("-password");
    if (!updatedPrestataire) {
      return res.status(404).json({ message: "Prestataire non trouvé" });
    }

    res.status(200).json({
      message: "Prestataire mis à jour avec succès",
      prestataire: updatedPrestataire,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

const deletePrestataire = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPrestataire = await Prestataire.findByIdAndDelete(id);

    if (!deletedPrestataire) {
      return res.status(404).json({ message: "Prestataire non trouvé" });
    }

    // Retirer le prestataire supprimé des sous-prestations
    await SousPrestation.updateMany(
      { prestataires: id },
      { $pull: { prestataires: id } },
    );

    res.status(200).json({
      message:
        "Prestataire supprimé avec succès et retiré des sous-prestations",
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

//fetch plusieurs prestataires par leurs id
const getMultiplePrestataires = async (req, res) => {
  try {
    const { ids } = req.body;

    // Vérifier si 'ids' est bien un tableau
    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ message: "Veuillez fournir une liste d'IDs valide." });
    }

    const prestataires = await Prestataire.find({ _id: { $in: ids } }).select(
      "-password",
    );
    res
      .status(200)
      .json({ message: "Prestataires récupérés avec succès", prestataires });
  } catch (error) {
    console.error("Erreur lors de la récupération des prestataires:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// à revoir et tester ce code en bas

// Ajouter une réalisation (image/vidéo) à un prestataire
const addRealisation = async (req, res) => {
  try {
    const { id } = req.params; // ID du prestataire
    const { realisationUrl } = req.body; // URL de l'image ou vidéo

    const prestataire = await Prestataire.findById(id);
    if (!prestataire) {
      return res.status(404).json({ message: "Prestataire non trouvé" });
    }

    prestataire.realisations.push(realisationUrl);
    await prestataire.save();

    res
      .status(200)
      .json({ message: "Réalisation ajoutée avec succès", prestataire });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Supprimer une réalisation d'un prestataire
const deleteRealisation = async (req, res) => {
  try {
    const { id, realisationId } = req.params;

    const prestataire = await Prestataire.findById(id);
    if (!prestataire) {
      return res.status(404).json({ message: "Prestataire non trouvé" });
    }

    // Supprime la réalisation par son URL
    prestataire.realisations = prestataire.realisations.filter(
      (realisation) => realisation !== realisationId,
    );
    await prestataire.save();

    res
      .status(200)
      .json({ message: "Réalisation supprimée avec succès", prestataire });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Configuration de Multer
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    ,
    "image/png",
    "image/gif",
    "video/mp4",
    "video/mpeg",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Format de fichier non pris en charge (JPEG, JPG, PNG, GIF, MP4 uniquement)",
      ),
      false,
    );
  }
};

// Configuration de Multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Dossier où stocker les fichiers
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Générer un nom unique
  },
});

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // limite: 5MB max
});

// Route pour ajouter une image/vidéo
const uploadRealisation = async (req, res) => {
  try {
    const { id } = req.params;
    const fileUrl = `/uploads/${req.file.filename}`; // Chemin du fichier

    const prestataire = await Prestataire.findById(id);
    if (!prestataire) {
      return res.status(404).json({ message: "Prestataire non trouvé" });
    }

    prestataire.realisations.push(fileUrl);
    await prestataire.save();

    res.status(200).json({ message: "Fichier uploadé avec succès", fileUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  register,
  login,
  getAllPrestataires,
  getPrestataireById,
  updatePrestataire,
  deletePrestataire,
  addRealisation,
  deleteRealisation,
  upload,
  uploadRealisation,
  getMultiplePrestataires,
};
