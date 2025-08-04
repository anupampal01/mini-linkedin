import React, { useState } from "react";

export default function PostCard({ post, isOwner, onEdit, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);

  const author = post?.author || {
    name: "Unknown User",
    avatar: "/default-avatar.png",
    bio: "No bio available",
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <img
          src={author.avatar || "/default-avatar.png"}
          alt={author.name}
          className="post-avatar"
        />
        <div className="post-user-info">
          <h4>{author.name}</h4>
          <p className="post-bio">{author.bio || "No bio available"}</p>
          <span className="post-date">
            {new Date(post.createdAt).toLocaleString()}
          </span>
        </div>

        {isOwner && (
          <div className="menu-container">
            <button
              className="menu-toggle"
              onClick={() => setShowMenu(!showMenu)}
            >
              ⋮
            </button>
            {showMenu && (
              <div className="menu">
                <button onClick={() => onEdit(post)} className="menu-item">
                  Edit
                </button>
                <button
                  onClick={() => onDelete(post._id)}
                  className="menu-item delete"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="post-content">{post.content}</p>

      {post.image && <img src={post.image} alt="Post" className="post-image" />}
    </div>
  );
}
