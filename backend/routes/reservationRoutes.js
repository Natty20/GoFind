const express = require("express");
const router = express.Router();

const {
  getReservationsByClient,
  createReservation,
  getReservationsByPrestataire,
  deleteReservation,
  acceptReservation,
  updateReservation,
  declineReservation,
  getAllReservations,
  getReservationById,
} = require("../controllers/reservationController");

const {
  authorizeAdmin,
  authenticateUser,
} = require("../middlewares/authMiddleware");


// CLIENT

router.post("/new", createReservation);
router.get("/client/:clientId", authenticateUser, getReservationsByClient);


// PRESTATAIRE
router.get(
  "/prestataire/:prestataireId",
  authenticateUser,
  getReservationsByPrestataire
);

router.put(
  "/:reservationId/accept",
  authenticateUser,
  acceptReservation
);

router.put(
  "/:reservationId/decline",
  authenticateUser,
  declineReservation
);

// ADMIN
router.get(
  "/all",
  authenticateUser,
  authorizeAdmin,
  getAllReservations
);

router.get(
  "/:id",
  authenticateUser,
  authorizeAdmin,
  getReservationById
);

router.put(
  "/:id",
  authenticateUser,
  authorizeAdmin,
  updateReservation
);

router.delete(
  "/:id",
  authenticateUser,
  authorizeAdmin,
  deleteReservation
);

module.exports = router;
