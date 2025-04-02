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
    // faire une vérification d'abord si le client et le prestataire existent dans la bdd
    const client = await Client.findById(clientId);
    const prestataire = await Prestataire.findById(prestataireId);
    if (!client || !prestataire) {
      return res
        .status(404)
        .json({ message: "Client ou Prestataire introuvable." });
    }
    // voir si les prestations et sous-presta choisi existent dans la bdd
    const prestationsData = await Promise.all(
      prestations.map(async (prestation) => {
        const prestationObj = await Prestation.findById(
          prestation.prestationId,
        );
        if (!prestationObj) {
          throw new Error("Prestation non trouvée.");
        }
        const sousPrestationsData = await Promise.all(
          prestation.sousPrestations.map(async (sousPrestationId) => {
            const sousPrestationObj =
              await SousPrestation.findById(sousPrestationId);
            if (!sousPrestationObj) {
              throw new Error("Sous-prestation non trouvée.");
            }
            return sousPrestationObj._id;
          }),
        );
        return {
          prestationId: prestationObj._id,
          sousPrestations: sousPrestationsData,
        };
      }),
    );
    const newReservation = new Reservation({
      client: clientId,
      prestataire: prestataireId,
      prestations: prestationsData,
      date,
      heure,
      modePaiement,
      description,
    });
    await newReservation.save();
    res.status(201).json({
      message: "Réservation créée avec succès",
      reservation: newReservation,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur du serveur", error: error.message });
  }
};

const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("client", "nom prenom phone")
      .populate("prestataire", "nom profilePicture")
      .populate({
        path: "prestations.prestationId",
        select: "nom",
      })
      .populate({
        path: "prestations.sousPrestations",
        select: "nom",
      });

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur", error });
  }
};

const getReservationsByClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const reservations = await Reservation.find({ client: clientId })
      .populate("prestataire", "nom profilePicture")
      .populate({
        path: "prestations.prestationId",
        select: "nom",
      })
      .populate({
        path: "prestations.sousPrestations",
        select: "nom",
      });

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

const getReservationsByPrestataire = async (req, res) => {
  try {
    const { prestataireId } = req.params;
    const reservations = await Reservation.find({ prestataire: prestataireId })
      .populate("client", "nom prenom phone")
      .populate({
        path: "prestations.prestationId",
        select: "nom",
      })
      .populate({
        path: "prestations.sousPrestations",
        select: "nom",
      });

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

const deleteReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const reservation = await Reservation.findByIdAndDelete(reservationId);

    if (!reservation) {
      return res
        .status(404)
        .json({ message: "Réservation non trouvée dans la bdd" });
    }

    res.status(200).json({ message: "Réservation supprimée avec succès!" });
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur", error });
  }
};

const acceptReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res
        .status(404)
        .json({ message: "Réservation non trouvée dans la bdd" });
    }

    reservation.etat = "acceptée";
    await reservation.save();

    res
      .status(200)
      .json({ message: "Réservation acceptée avec succès!", reservation });
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur", error });
  }
};

const declineReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res
        .status(404)
        .json({ message: "Réservation non trouvée dans la bdd" });
    }

    reservation.etat = "déclinée";
    await reservation.save();

    res
      .status(200)
      .json({ message: "Réservation déclinée avec succès!", reservation });
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur", error });
  }
};

module.exports = {
  createReservation,
  getAllReservations,
  getReservationsByClient,
  getReservationsByPrestataire,
  deleteReservation,
  acceptReservation,
  declineReservation,
};
