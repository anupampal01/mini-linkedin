import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function SidebarLeft() {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="sidebar-left">
      <div className="profile-card">
        <img
          src={user.avatar || "/default-avatar.png"}
          alt="Profile"
          className="avatar"
        />
        <h3 className="profile-name">{user.name}</h3>
        <p className="profile-title">{user.bio || "No bio yet"}</p>
        <Link to="/profile" className="view-profile-link">
          View Profile
        </Link>
      </div>
    </div>
  );
}
