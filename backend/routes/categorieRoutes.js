// routes/serviceRoutes.js
const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizeAdmin,
} = require("../middlewares/authMiddleware");
const {
  getAllPrestations,
  createPrestation,
  updatePrestation,
  deletePrestation,
  getPrestationById,
} = require("../controllers/prestationController");

router.get("/", getAllPrestations);
router.post("/", authenticateUser, authorizeAdmin, createPrestation);
router.put("/:id", authenticateUser, authorizeAdmin, updatePrestation);
router.delete("/:id", authenticateUser, authorizeAdmin, deletePrestation);
router.get("/:id", getPrestationById);

module.exports = router;
