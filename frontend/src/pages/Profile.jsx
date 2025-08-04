import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getProfile, updateProfile, deleteProfile } from "../services/authService";
import postService from "../services/postService";
import { useToast } from "../context/ToastContext";
import "../App.css";

export default function Profile() {
  const { user, logout, login } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [posts, setPosts] = useState([]);
  const { showToast } = useToast();

  // Fetch profile
  useEffect(() => {
    if (user) {
      getProfile(user.token)
        .then((data) => {
          setProfile(data);
          setName(data.name);
          setBio(data.bio || "");
        })
        .catch(() => logout()); // If token invalid, force logout
    }
  }, [user]);

  // Fetch posts
  useEffect(() => {
    if (user) {
      postService.getUserPosts(user.id).then(setPosts);
    }
  }, [user]);

  if (!user) return <p>Please log in to view your profile</p>;
  if (!profile) return <p>Loading profile...</p>;

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);
      if (avatarFile) formData.append("avatar", avatarFile);

      const updatedUser = await updateProfile(user.token, formData);
      setProfile(updatedUser);
      login(updatedUser); // Update context
      setEditMode(false);
      showToast("Profile updated successfully!", "success");
    } catch (err) {
      showToast("Failed to update profile.", "error");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your profile?")) {
      await deleteProfile(user.token);
      logout(); // Clears context and redirects
      showToast("Profile deleted successfully!", "success");
    }
  };

  return (
  <div className="profile-page">
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={profile.avatar || "/default-avatar.png"}
          alt="avatar"
          className="avatar"
        />

        {editMode && (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files[0])}
          />
        )}

        {editMode ? (
          <>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Bio"
            ></textarea>
            <button onClick={handleSave} className="btn btn-primary">
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <h2>{profile.name}</h2>
            <p>{profile.email}</p>
            <p>{profile.bio || "No bio added yet."}</p>
            <button onClick={() => setEditMode(true)} className="btn btn-primary">
              Edit Profile
            </button>
            <button onClick={handleDelete} className="btn btn-danger">
              Delete Profile
            </button>
          </>
        )}
      </div>

      <h3 className="sub-title">Your Posts</h3>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id} className="post-item">
            <p>{post.content}</p>
            {post.image && (
              <img src={post.image} alt="post" className="post-thumb" />
            )}
            <small>{new Date(post.createdAt).toLocaleString()}</small>
          </div>
        ))
      ) : (
        <p className="info-text">No posts yet</p>
      )}
    </div>
  </div>
);
}
