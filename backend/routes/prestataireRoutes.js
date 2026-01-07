const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getAllPrestataires,
  updatePrestataire,
  deletePrestataire,
  getMultiplePrestataires,
  getPrestataireById,
  addRealisation,
  deleteRealisation,
} = require("../controllers/prestataireController");

const { authenticateUser, authorizeAdmin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploads"); 

// login registr ...
router.post("/register", register);
router.post("/login", login);
router.get("/", getAllPrestataires);
router.get("/:id", getPrestataireById);

router.put(
  "/:id",
  authenticateUser,
  (req, res, next) => {
    // Seul le prestataire lui-même ou l'admin peut modifier
    if (req.user.role === "admin" || req.user.id === req.params.id) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "Accès interdit pour la modification!" });
    }
  },
  updatePrestataire
);

router.delete("/:id", authenticateUser, authorizeAdmin, deletePrestataire);
router.post("/multiple", getMultiplePrestataires);

// pour les reas
router.post(
  "/prestataire/:id/realisations",
  authenticateUser,
  upload.single("image"),
  addRealisation
);


router.delete(
  "/prestataire/:id/realisations/:realisationId",
  authenticateUser,
  deleteRealisation
);

module.exports = router;
