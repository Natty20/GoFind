const express = require("express");
const {
    createAvis,
    updateMyAvis,
    deleteMyAvis,
    getAllVisibleAvis,
    getAvisForPrestataire,
    toggleAvisVisibility,
    adminDeleteAvis,
    getAvisById,
    getAllAvisAdmin
} = require("../controllers/avisController");

const {
    authenticateUser,
    authorizeClient,
    authorizePrestataire,
    authorizeAdmin,
} = require("../middlewares/authMiddleware");
const {
    optionalAuthenticateUser
} = require('../middlewares/optionalAuthenticateUser');


const router = express.Router();

// Créer un avis
router.post("/", authenticateUser, authorizeClient, createAvis);

// Modifier SON avis
router.put("/:id", authenticateUser, authorizeClient, updateMyAvis);

// Supprimer SON avis
router.delete("/client/:id", authenticateUser, authorizeClient, deleteMyAvis);

//  Avis visibles (public ou client)
router.get(
    '/public',
    optionalAuthenticateUser,
    getAllVisibleAvis
);

//  Prestataire → ses avis
router.get(
    "/prestataire",
    authenticateUser,
    authorizePrestataire,
    getAvisForPrestataire
);

// Admin ou prestataire → masquer / afficher
router.patch(
    "/:id/visibility",
    authenticateUser,
    (req, res, next) => {
        if (req.user.role === "admin" || req.user.role === "prestataire") {
            return next();
        }
        return res.status(403).json({ message: "Accès refusé" });
    },
    toggleAvisVisibility
);

//  ADMIN 
router.get('/admin', authenticateUser, authorizeAdmin, getAllAvisAdmin);
router.get(
    '/:id',
    authenticateUser,
    authorizeAdmin,
    getAvisById
);
router.delete(
    "/:id",
    authenticateUser,
    authorizeAdmin,
    adminDeleteAvis
);

module.exports = router;
