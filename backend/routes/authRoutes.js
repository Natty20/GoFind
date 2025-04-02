const express = require("express");
const {
  register,
  login,
  getAllClients,
  updateClient,
  deleteClient,
  getClientById,
} = require("../controllers/authController");
const {
  authenticateUser,
  authorizeAdmin,
} = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/clients", authenticateUser, authorizeAdmin, getAllClients);
router.get("/clients/:id", getClientById);
router.put(
  "/:id",
  authenticateUser,
  (req, res, next) => {
    if (req.user.role === "admin" || req.user.id === req.params.id) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "Accès interdit pour la modification!" });
    }
  },
  updateClient,
); //seul le client et l'admin peut modifier son compte
router.delete("/:id", authenticateUser, authorizeAdmin, deleteClient);

module.exports = router;
