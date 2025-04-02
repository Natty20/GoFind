// routes/userRoutes.js
const express = require("express");
const {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { verifyTokenAndAdmin } = require("../middleware/auth");
const router = express.Router();

router.post("/", createUser);
router.get("/", verifyTokenAndAdmin, getAllUsers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
