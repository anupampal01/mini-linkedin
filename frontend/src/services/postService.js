import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL + "/posts";

// Helper to create FormData
const buildFormData = (content, image) => {
  const formData = new FormData();
  formData.append("content", content);
  if (image) formData.append("image", image); // file or string
  return formData;
};

// Create post
const createPost = async (content, image, token) => {
  const formData = buildFormData(content, image);
  const res = await axios.post(API_URL, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// Get all posts
const getPosts = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

// Get posts by user ID
const getUserPosts = async (userId) => {
  const res = await axios.get(`${API_URL}/user/${userId}`);
  return res.data;
};

// Update post
const updatePost = async (id, content, image, token) => {
  const formData = buildFormData(content, image);
  const res = await axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// Delete post
const deletePost = async (id, token) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const postService = { createPost, getPosts, getUserPosts, updatePost, deletePost };
export default postService;
