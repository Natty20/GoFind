const express = require("express");
const router = express.Router();
const { 
    getReservationsByClient, 
    createReservation, 
    getReservationsByPrestataire, 
    deleteReservation, 
    acceptReservation, 
    declineReservation, 
    getAllReservations } = require ("../controllers/reservationController")

//Créer une réservation
router.post("/new", createReservation);
router.get("/client/:clientId", getReservationsByClient);


// Récupérer les réservations d'un prestataire
router.get("/prestataire/:prestataireId", getReservationsByPrestataire);
router.put("/:reservationId/accept", acceptReservation);
router.put("/:reservationId/decline", declineReservation);

// pour les admins
router.get("/all", getAllReservations);
router.delete("/:reservationId", deleteReservation);

module.exports = router;
