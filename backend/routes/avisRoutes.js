const express = require ("express");
const {
    createAvis,
    updateMyAvis,
    deleteMyAvis,
    getAllVisibleAvis,
    getAvisForPrestataire,
    toggleAvisVisibility,
    adminDeleteAvis,
} = require("../controllers/avisController");

const {
    authenticateUser,
    authorizeClient,
    authorizePrestataire,
    authorizeAdmin,
} = require("../middlewares/authMiddleware");

const router = express.Router();

/* CLIENT */
router.post('/', authenticateUser, authorizeClient, createAvis);
router.put('/:id', authenticateUser, authorizeClient, updateMyAvis);
router.delete('/:id', authenticateUser, authorizeClient, deleteMyAvis);

/* LECTURE */
router.get('/public', authenticateUser, getAllVisibleAvis);
router.get(
    '/prestataire',
    authenticateUser,
    authorizePrestataire,
    getAvisForPrestataire
);

/* MODÉRATION */
router.patch(
    '/:id/visibility',
    authenticateUser,
    (req, res, next) => {
        if (req.user.role === 'admin') return next();
        if (req.user.role === 'prestataire') return next();
        return res.status(403).json({ message: 'Accès refusé' });
    },
    toggleAvisVisibility
);

router.delete(
    '/admin/:id',
    authenticateUser,
    authorizeAdmin,
    adminDeleteAvis
);

module.exports= router;
