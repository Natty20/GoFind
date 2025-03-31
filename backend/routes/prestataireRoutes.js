const express = require("express");
const { register, login, getAllPrestataires, updatePrestataire, deletePrestataire, addRealisation, 
    deleteRealisation, uploadRealisation, getMultiplePrestataires, getPrestataireById } = require("../controllers/prestataireController");
const { upload } = require("../controllers/prestataireController");
const { authenticateUser, authorizeAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", upload.single("profilePicture"), register);
router.post("/login", login);
router.get("/", getAllPrestataires);
router.get("/:id", getPrestataireById);
router.put('/:id', authenticateUser, (req, res, next) => {
    if (req.user.role === "admin" || req.user.id === req.params.id) {
        next();
    } else {
        return res.status(403).json({ message: "Accès interdit pour la modification!" });
    }
}, updatePrestataire); //seul le prestataire et l'admin peut modifier son compte 
router.delete("/:id", authenticateUser, authorizeAdmin, deletePrestataire);
router.post("/multiple", getMultiplePrestataires);


router.post("/:id/realisations", addRealisation);
router.delete("/:id/realisations/:realisationId", deleteRealisation);
router.post("/:id/realisations/upload", upload.single("file"), uploadRealisation);

module.exports = router;
