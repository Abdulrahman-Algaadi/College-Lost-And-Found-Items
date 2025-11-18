import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "Js/Navbar";
import HomePage from "pages/HomePage";
import LoginPage from "pages/login";
import BrowseItems from "pages/BrowseItems";
import AdminDashboard from "pages/AdminDashboard";

function App() {
  const [isAdmin, setAdmin] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const logout = () => setAdmin(false);

  return (
    <Router>
      <Navbar isAdmin={isAdmin} logout={logout} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage setAdmin={setAdmin} />} />
        <Route
          path="/BrowseItems"
          element={<BrowseItems isAdmin={isAdmin} refreshTrigger={refresh} />}
        />
        <Route path="admin" element={<AdminDashboard isAdmin={isAdmin} />} />
      </Routes>
    </Router>
  );
}

export default App;
