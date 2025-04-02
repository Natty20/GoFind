const SousPrestation = require("../models/SousPrestation");
const Prestation = require("../models/Prestation");

// get all
const getAllSousPrestations = async (req, res) => {
  try {
    const sousprestations = await SousPrestation.find();
    res.status(200).json({
      message: "Sous-prestations récupérées avec succès",
      sousprestations,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des sous-prestations :",
      error,
    );
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// get by id
const getSousPrestationById = async (req, res) => {
  try {
    const { id } = req.params;
    const sousPrestation =
      await SousPrestation.findById(id).populate("prestataires");

    if (!sousPrestation) {
      return res.status(404).json({ message: "Sous-prestation non trouvée" });
    }

    res.status(200).json({
      message: "Sous-prestation récupérée avec succès",
      sousPrestation,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la sous-prestation :",
      error,
    );
    res.status(500).json({ message: "Erreur serveur! c est impossible" });
  }
};

// add new
const addSousPrestation = async (req, res) => {
  try {
    const { prestationId } = req.params;
    const {
      nom,
      title,
      shortDescription,
      longDescription,
      profileImage,
      backgroundImage,
    } = req.body;

    // Vérifier si la prestation existe d'abord déja et créer un nv
    const prestation = await Prestation.findById(prestationId);
    if (!prestation) {
      return res.status(404).json({ message: "Prestation non trouvée." });
    }

    const newSousPrestation = new SousPrestation({
      nom,
      title,
      shortDescription,
      longDescription,
      profileImage,
      backgroundImage,
      prestation: prestationId,
    });

    await newSousPrestation.save();

    prestation.sousPrestations.push(newSousPrestation._id);
    await prestation.save();

    res.status(201).json({
      message: "Sous-prestation ajoutée avec succès.",
      sousPrestation: newSousPrestation,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la sous-prestation :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// update
const updateSousPrestation = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nom,
      title,
      shortDescription,
      longDescription,
      profileImage,
      backgroundImage,
    } = req.body;

    const updatedSousPrestation = await SousPrestation.findByIdAndUpdate(
      id,
      {
        nom,
        title,
        shortDescription,
        longDescription,
        profileImage,
        backgroundImage,
      },
      { new: true },
    );

    if (!updatedSousPrestation) {
      return res.status(404).json({ message: "Sous-prestation non trouvée" });
    }

    res.status(200).json({
      message: "Sous-prestation mise à jour avec succès",
      sousPrestation: updatedSousPrestation,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour de la sous-prestation :",
      error,
    );
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// delete
const deleteSousPrestation = async (req, res) => {
  try {
    const { id } = req.params;

    const sousPrestation = await SousPrestation.findById(id);
    if (!sousPrestation) {
      return res.status(404).json({ message: "Sous-prestation non trouvée" });
    }

    // delete  sous-prestation de la prestation associée
    await Prestation.findByIdAndUpdate(sousPrestation.prestation, {
      $pull: { sousPrestations: id },
    });

    await SousPrestation.findByIdAndDelete(id);

    res.status(200).json({ message: "Sous-prestation supprimée avec succès" });
  } catch (error) {
    console.error(
      "Erreur lors de la suppression de la sous-prestation :",
      error,
    );
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer les autres sous-prestations liées à la même prestation
const getSousPrestationsByPrestation = async (req, res) => {
  try {
    const { prestationId } = req.params;

    // Vérifier si la prestation existe
    const sousPrestations = await SousPrestation.find({
      prestation: prestationId,
    });

    if (!sousPrestations.length) {
      return res.status(404).json({
        message: "Aucune autre sous-prestation trouvée pour cette prestation",
      });
    }

    res.json({
      message: "Sous-prestations liées récupérées avec succès",
      sousPrestations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
// get all presta d'un sous-prestation
const getSousPrestationWithPrestataires = async (req, res) => {
  try {
    const { id } = req.params;

    const sousPrestation = await SousPrestation.findById(id).populate({
      path: "prestataires",
      select: "nom email phone", // Choisis les champs nécessaires
    });

    if (!sousPrestation) {
      return res.status(404).json({ message: "Sous-prestation non trouvée" });
    }

    res.status(200).json({
      message: "Sous-prestation et ses prestataires récupérés avec succès",
      sousPrestation,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  getAllSousPrestations,
  getSousPrestationById,
  addSousPrestation,
  updateSousPrestation,
  deleteSousPrestation,
  getSousPrestationsByPrestation,
  getSousPrestationWithPrestataires,
};
