const express = require("express");
const router = express.Router();
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
const {
  authorizeAdmin,
  authenticateUser,
} = require("../middlewares/authMiddleware");

//Créer une réservation
router.post("/new", createReservation);
router.get("/client/:clientId", getReservationsByClient);

// Récupérer les réservations d'un prestataire
router.get("/prestataire/:prestataireId", getReservationsByPrestataire);
router.put("/:reservationId/accept", acceptReservation);
router.put("/:reservationId/decline", declineReservation);

// pour les admins
router.get("/all", authenticateUser, authorizeAdmin, getAllReservations);
router.delete("/:id", deleteReservation, authorizeAdmin, authenticateUser);
router.get("/:id", getReservationById, authorizeAdmin, authenticateUser);

module.exports = router;
