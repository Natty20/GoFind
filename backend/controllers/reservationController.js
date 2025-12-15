const Reservation = require("../models/Reservation");
const Client = require("../models/Client");
const Prestataire = require("../models/Prestataire");
const Prestation = require("../models/Prestation");
const SousPrestation = require("../models/SousPrestation");

const createReservation = async (req, res) => {
  try {
    const {
      clientId,
      prestataireId,
      prestations,
      date,
      heure,
      modePaiement,
      description,
    } = req.body;

    const client = await Client.findById(clientId);
    const prestataire = await Prestataire.findById(prestataireId);

    if (!client || !prestataire) {
      return res.status(404).json({
        message: "Client ou Prestataire introuvable.",
      });
    }

    const prestationsData = await Promise.all(
      prestations.map(async (p) => {
        const prestation = await Prestation.findById(p.prestationId);
        if (!prestation) throw new Error("Prestation non trouvée");

        const sousPrestations = await Promise.all(
          p.sousPrestations.map(async (spId) => {
            const sp = await SousPrestation.findById(spId);
            if (!sp) throw new Error("Sous-prestation non trouvée");
            return sp._id;
          })
        );

        return {
          prestationId: prestation._id,
          sousPrestations,
        };
      })
    );

    const reservation = new Reservation({
      client: clientId,
      prestataire: prestataireId,
      prestations: prestationsData,
      date,
      heure,
      modePaiement,
      description,
    });

    await reservation.save();

    res.status(201).json({
      message: "Réservation créée avec succès",
      reservation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur du serveur",
      error: error.message,
    });
  }
};


const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("client", "nom prenom phone")
      .populate("prestataire", "nom profilePicture")
      .populate("prestations.prestationId", "nom")
      .populate("prestations.sousPrestations", "nom");

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate("client", "nom prenom phone")
      .populate("prestataire", "nom profilePicture")
      .populate("prestations.prestationId", "nom")
      .populate("prestations.sousPrestations", "nom");

    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    res.status(200).json({ reservation });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

const getReservationsByClient = async (req, res) => {
  try {
    const reservations = await Reservation.find({
      client: req.params.clientId,
    })
      .populate("prestataire", "nom profilePicture")
      .populate("prestations.prestationId", "nom")
      .populate("prestations.sousPrestations", "nom");

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

const getReservationsByPrestataire = async (req, res) => {
  try {
    const reservations = await Reservation.find({
      prestataire: req.params.prestataireId,
    })
      .populate("client", "nom prenom phone")
      .populate("prestations.prestationId", "nom")
      .populate("prestations.sousPrestations", "nom");

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


const updateReservation = async (req, res) => {
  try {
    const allowedFields = [
      "date",
      "heure",
      "etat",
      "modePaiement",
      "description",
      "prestataire",
    ];

    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        message: "Réservation non trouvée",
      });
    }

    res.status(200).json({
      message: "Réservation supprimée avec succès",
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


const acceptReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.reservationId);
    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    reservation.etat = "acceptée";
    await reservation.save();

    res.status(200).json({ reservation });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

const declineReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.reservationId);
    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    reservation.etat = "déclinée";
    await reservation.save();

    res.status(200).json({ reservation });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

module.exports = {
  createReservation,
  getAllReservations,
  getReservationById,
  getReservationsByClient,
  getReservationsByPrestataire,
  updateReservation,
  deleteReservation,
  acceptReservation,
  declineReservation,
};
