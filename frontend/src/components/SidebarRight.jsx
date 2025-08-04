import React from "react";

export default function SidebarRight() {
  return (
    <div className="sidebar-right">
      <div className="suggestions-card">
        <h3 className="suggestions-title">Suggestions</h3>
        <p className="suggestions-subtitle">People you may know</p>
        <ul className="suggestions-list">
          <li>Rohan Verma - React Developer</li>
          <li>Ishaan Mehta - UI Designer</li>
          <li>Kavya Rao - Backend Engineer</li>
        </ul>
      </div>
    </div>
  );
}
