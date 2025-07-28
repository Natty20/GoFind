const Prestation = require("../models/Prestation");
const SousPrestation = require("../models/SousPrestation");

const createPrestation = async (req, res) => {
  try {
    const {
      nom,
      shortDescription,
      longDescription,
      profileImage,
      backgroundImage,
      sousPrestations,
    } = req.body;
    const prestation = new Prestation({
      nom,
      shortDescription,
      longDescription,
      profileImage,
      backgroundImage,
    });
    await prestation.save();

    const sousPrestationDocs = await Promise.all(
      sousPrestations.map(async (sous) => {
        const newSousPrestation = new SousPrestation({
          nom: sous.nom,
          title: sous.title,
          shortDescription: sous.shortDescription,
          longDescription: sous.longDescription,
          profileImage: sous.profileImage,
          backgroundImage: sous.backgroundImage,
          prestation: prestation._id, // Lier à la prestation créée
        });
        return await newSousPrestation.save();
      }),
    );
    // puis ajoute les sous-prestations à la prestation et save
    prestation.sousPrestations = sousPrestationDocs.map((sp) => sp._id);
    await prestation.save();

    res.status(201).json({
      message: "Prestation et ses sous-prestations créée avec succès",
      prestation,
      sousPrestations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const getAllPrestations = async (req, res) => {
  try {
    const prestations = await Prestation.find().populate("sousPrestations");
    res.status(200).json({
      message: "Prestations récupérées avec succès",
      prestations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const getPrestationById = async (req, res) => {
  try {
    const { id } = req.params;
    const prestation = await Prestation.findById(id);

    if (!prestation) {
      return res.status(404).json({ message: "Prestation non trouvée" });
    }

    res.status(200).json({
      message: "Prestation récupérée avec succès!",
      prestation,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du prestation :", error);
    res.status(500).json({ message: "Erreur serveur! c est impossible" });
  }
};

const updatePrestation = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nom,
      shortDescription,
      longDescription,
      overlayDescription,
      profileImage,
      backgroundImage,
      overlayImage,
    } = req.body; // Data from request body

    const updatedPrestation = await Prestation.findByIdAndUpdate(
      id,
      {
        nom,
        shortDescription,
        longDescription,
        overlayDescription,
        profileImage,
        backgroundImage,
        overlayImage,
      },
      { new: true },
    );

    if (!updatedPrestation) {
      return res.status(404).json({ message: "prestation not found" });
    }
    res.status(200).json({
      message: "Prestation updated successfully",
      prestation: updatedPrestation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const deletePrestation = async (req, res) => {
  try {
    const { id } = req.params;
    const deletePrestation = await Prestation.findByIdAndDelete(id);
    if (!deletePrestation) {
      return res.status(404).json({ message: "Prestation not found" });
    }
    res.status(200).json({
      message: "Prestation deleted successfully",
      prestation: deletePrestation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createPrestation,
  updatePrestation,
  getAllPrestations,
  getPrestationById,
  deletePrestation,
};
