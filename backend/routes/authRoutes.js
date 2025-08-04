const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Register new user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Get current user profile
router.get("/profile", protect, getUserProfile);

// Update user profile (with avatar upload)
router.put("/profile", protect, upload.single("avatar"), updateProfile);

// Delete user profile
router.delete("/profile", protect, deleteProfile);

module.exports = router;
