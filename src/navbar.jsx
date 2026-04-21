import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="navbar">
      <div className="nav-logo">
        <Link to="/" className="logo-link">amazon.in</Link>
      </div>

      <div className="nav-search">
        <input
          type="text"
          placeholder="Search products..."
          className="search-input"
        />
        <button className="search-button">Search</button>
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/signup">Sign up</Link>
        <Link to="/login">Sign in</Link>
        <Link to="/cart">Cart</Link>
      </div>
    </div>
  );
}