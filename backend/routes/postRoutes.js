const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  createPost,
  getPosts,
  getMyPosts,
  getUserPosts,
  updatePost,
  deletePost,
} = require("../controllers/postController");

const router = express.Router();

// Public: Get all posts
router.get("/", getPosts);

// Public: Get posts by specific user
router.get("/user/:userId", getUserPosts);

// Protected: Get my posts
router.get("/me", protect, getMyPosts);

// Protected: Create a post
router.post("/", protect, upload.single("image"), createPost);

// Protected: Update a post
router.put("/:id", protect, upload.single("image"), updatePost);

// Protected: Delete a post
router.delete("/:id", protect, deletePost);

module.exports = router;
