const Post = require("../models/Post");
const cloudinary = require("../config/cloudinary");

// Helper to delete old Cloudinary image
const deleteCloudinaryImage = async (url) => {
  if (url && url.includes("cloudinary")) {
    const publicId = url.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`posts/${publicId}`);
  }
};

// Create post
exports.createPost = async (req, res) => {
  try {
    const { content, image } = req.body;
    let imageUrl = null;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Post content is required" });
    }

    // Upload file to Cloudinary
    if (req.file) {
      const uploadRes = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        { folder: "posts" }
      );
      imageUrl = uploadRes.secure_url;
    } else if (image) {
      imageUrl = image;
    }

    const post = await Post.create({
      content,
      image: imageUrl,
      author: req.user._id,
    });

    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name avatar bio")
      .sort({ createdAt: -1 });

    // Filter posts with missing authors
    const safePosts = posts.filter((post) => post.author !== null);

    res.json(safePosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my posts
exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .populate("author", "name avatar bio")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get posts by user
exports.getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ author: userId })
      .populate("author", "name avatar bio")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, image } = req.body;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this post" });
    }

    if (content) post.content = content;

    if (req.file) {
      await deleteCloudinaryImage(post.image);
      const uploadRes = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        { folder: "posts" }
      );
      post.image = uploadRes.secure_url;
    } else if (image) {
      post.image = image;
    }

    await post.save();
    res.json({ message: "Post updated successfully", post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await deleteCloudinaryImage(post.image);
    await post.remove();

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
