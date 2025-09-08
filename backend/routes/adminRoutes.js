const express = require("express");
const {
  register,
  login,
  deleteAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
} = require("../controllers/adminController");
const {
  authenticateUser,
  authorizeAdmin,
} = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/:id", getAdminById, authorizeAdmin, authenticateUser);
router.get("/", authenticateUser, authorizeAdmin, getAllAdmins);
router.delete("/:id", authenticateUser, authorizeAdmin, deleteAdmin);
router.put(
  "/:id",
  authenticateUser,
  (req, res, next) => {
    if (req.user.role === "admin") {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "Accès interdit pour la modification!" });
    }
  },
  updateAdmin,
);

module.exports = router;
