import React from "react";
import BrowseItems from "./BrowseItems";

export default function AdminDashboard({ isAdmin }) {
  if (!isAdmin) return <p>Access Denied</p>;
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <BrowseItems isAdmin={isAdmin} />
    </div>
  );
}
