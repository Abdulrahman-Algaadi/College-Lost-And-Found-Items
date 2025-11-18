const API_URL = "https://localhost:5152/api";

export async function getItems() {
  const response = await fetch(`${API_URL}/items`);
  return await response.json();
}

export async function deleteItem(id) {
  await fetch(`${API_URL}/items/${id}`, { method: "DELETE" });
}
