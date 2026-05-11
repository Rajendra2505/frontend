import React from "react";
import "./dashboard.css";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">Amazon Admin</h2>

      <ul>
        <li>Dashboard</li>
        <li>Products</li>
        <li>Orders</li>
        <li>Users</li>
      </ul>
    </div>
  );
}