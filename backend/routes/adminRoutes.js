const express = require("express");
const {
  register,
  login,
  deleteAdmin,
  getAllAdmins,
} = require("../controllers/adminController");
const {
  authenticateUser,
  authorizeAdmin,
} = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/", authenticateUser, authorizeAdmin, getAllAdmins);
router.delete("/:id", authenticateUser, authorizeAdmin, deleteAdmin);

module.exports = router;
