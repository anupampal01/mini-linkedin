const User = require("../models/User");
const Post = require("../models/Post");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");

// Generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || "fallbackSecret", { expiresIn: "7d" });

// Helper: Delete Cloudinary image
const deleteCloudinaryImage = async (url, folder) => {
  if (!url || !url.includes("cloudinary")) return;
  const parts = url.split("/");
  const fileName = parts.pop().split(".")[0];
  await cloudinary.uploader.destroy(`${folder}/${fileName}`);
};

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, bio } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password, bio });

    res.status(201).json({
      message: "Registration successful",
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      avatar: user.avatar || null,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      message: "Login successful",
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      avatar: user.avatar || null,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Replace avatar if new file provided
    if (req.file) {
      if (user.avatar) await deleteCloudinaryImage(user.avatar, "avatars");
      const uploadRes = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        { folder: "avatars" }
      );
      user.avatar = uploadRes.secure_url;
    }

    if (req.body.name !== undefined) user.name = req.body.name;
    if (req.body.bio !== undefined) user.bio = req.body.bio;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      avatar: user.avatar || null,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Profile (Cascade delete posts + avatar)
exports.deleteProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete avatar
    if (user.avatar) await deleteCloudinaryImage(user.avatar, "avatars");

    // Delete user's posts and their images
    const posts = await Post.find({ author: user._id });
    for (const post of posts) {
      if (post.image) await deleteCloudinaryImage(post.image, "posts");
      await post.remove();
    }

    await User.findByIdAndDelete(user._id);

    res.json({ message: "Profile and all posts deleted successfully", deleted: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
