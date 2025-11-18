// Api.js
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

export async function getItemById(id) {
  // Try single-item endpoint first, fallback to getItems() and find
  try {
    const response = await fetch(`${API_URL}/items/GetItemById/${id}`);
    if (response.ok) return await response.json();
    // If not ok, fall through to fallback
    console.warn("getItemById: single-item endpoint failed, trying fallback.");
  } catch (err) {
    console.warn("getItemById single endpoint error:", err);
  }

  // Fallback: fetch all items and find by id
  try {
    const items = await getItems();
    return items.find((i) => String(i.id) === String(id)) || null;
  } catch (err) {
    console.error("getItemById fallback error:", err);
    return null;
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
    throw err;
  }
}

export async function getCategories() {
  try {
    const response = await fetch(`${API_URL}/categories/GetAllCategories`);
    if (!response.ok) throw new Error("Failed to fetch categories");
    return await response.json();
  } catch (err) {
    console.error("getCategories error:", err);
    return [];
  }
}

export async function getStatuses() {
  try {
    const response = await fetch(`${API_URL}/statuses/GetAllStatuses`);
    if (!response.ok) throw new Error("Failed to fetch statuses");
    return await response.json();
  } catch (err) {
    console.error("getStatuses error:", err);
    return [];
  }
}

export async function createItem(item) {
  try {
    const response = await fetch(`${API_URL}/items/CreateNewItem`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error("Create failed");
    return await response.json();
  } catch (err) {
    console.error("createItem error:", err);
    throw err;
  }
}

export async function updateItem(id, item) {
  try {
    const response = await fetch(`${API_URL}/items/UpdateItemByID/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error("Update failed");
    return await response.json();
  } catch (err) {
    console.error("updateItem error:", err);
    throw err;
  }
}
