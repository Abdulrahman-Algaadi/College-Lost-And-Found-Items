import React, { useEffect, useState } from "react";
import { ItemsAPI } from "../api/api";

export default function BrowseItems({ isAdmin, refreshTrigger }) {
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    const data = await ItemsAPI.getAll();
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, [refreshTrigger]);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this item?")) {
      await ItemsAPI.delete(id);
      fetchItems();
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto" }}>
      <h2>Browse Items</h2>
      {isAdmin && <p>You can edit or delete items as admin.</p>}
      <ul>
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: "10px" }}>
            <strong>{item.title}</strong> - {item.description}
            {isAdmin && (
              <>
                {" "}
                <button>Edit</button>{" "}
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
