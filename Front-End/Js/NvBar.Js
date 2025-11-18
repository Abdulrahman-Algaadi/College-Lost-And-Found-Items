import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ isAdmin, logout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clears admin state in App.js
    navigate("/"); // Redirect to homepage
  };

  return (
    <nav style={{ padding: "1rem", background: "#eee" }}>
      <Link to="/">Home</Link> | <Link to="/browse-items">Browse Items</Link> |{" "}
      {isAdmin ? (
        <>
          <Link to="/admin">Dashboard</Link> |{" "}
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}
