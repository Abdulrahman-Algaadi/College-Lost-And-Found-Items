import { getItems, deleteItem } from "./Api.js";

const itemsGrid = document.getElementById("items-grid");

// Function to load items into grid
async function loadHomePage() {
  const items = await getItems();
  itemsGrid.innerHTML = ""; // Clear previous items

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${item.photoUrl || "images/placeholder.png"}" alt="${
      item.title
    }">
      <div class="card-body">
        <h2>${item.title}</h2>
        <p>${item.description?.substring(0, 60)}...</p>
        <div class="card-actions">
          <button onclick="handleDelete(${item.id})">Delete</button>
        </div>
      </div>
    `;

    itemsGrid.appendChild(card);
  });
}

// Handle Delete
window.handleDelete = async (id) => {
  await deleteItem(id);
  loadHomePage();
};

// Event listener for Home link
document.getElementById("home-link").addEventListener("click", (e) => {
  e.preventDefault();
  loadHomePage();
});

// Load home page on first visit
document.addEventListener("DOMContentLoaded", () => {
  loadHomePage();
});
