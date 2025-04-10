const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizeAdmin,
} = require("../middlewares/authMiddleware");
const {
  getReservationsByClient,
  createReservation,
  getReservationsByPrestataire,
  deleteReservation,
  acceptReservation,
  declineReservation,
  getAllReservations,
  getReservationById,
} = require("../controllers/reservationController");

//Créer une réservation
router.post("/new", createReservation);
router.get("/client/:clientId", getReservationsByClient);

// Récupérer les réservations d'un prestataire
router.get("/prestataire/:prestataireId", getReservationsByPrestataire);
router.put("/:reservationId/accept", acceptReservation);
router.put("/:reservationId/decline", declineReservation);

// pour les admins
router.get("/all", getAllReservations, authenticateUser, authorizeAdmin);
router.delete("/:id", deleteReservation, authorizeAdmin, authenticateUser);
router.get("/:id", getReservationById, authorizeAdmin, authenticateUser);

module.exports = router;
