const API_URL = "http://localhost:5152/api";

export async function getItems() {
  try {
    const response = await fetch(`${API_URL}/items/GetAllItems`);
    if (!response.ok) throw new Error("Failed to fetch items");
    return await response.json();
  } catch (err) {
    console.error("getItems error:", err);
    return [];
  }
}

export async function deleteItem(id) {
  try {
    const response = await fetch(`${API_URL}/items/DeleteItemByID/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Delete failed");
  } catch (err) {
    console.error(`deleteItem error for id ${id}:`, err);
  }
}
export async function getCategories() {
  const response = await fetch(
    "http://localhost:5152/api/categories/GetAllCategories"
  );
  if (!response.ok) throw new Error("Failed to fetch categories");
  return await response.json();
}
// Api.js

export async function getStatuses() {
  const response = await fetch("http://localhost:5152/api/statuses/GetAllStatuses");
  if (!response.ok) throw new Error("Failed to fetch statuses");
  return await response.json();
}

export async function createItem(item) {
  const response = await fetch(`${API_URL}/items/CreateNewItem`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  return await response.json();
}

export async function updateItem(id, item) {
  const response = await fetch(`${API_URL}/items/UpdateItemByID/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  return await response.json();
}
