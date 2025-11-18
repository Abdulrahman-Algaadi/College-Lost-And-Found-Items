// Main.js
import {
  getItems,
  deleteItem,
  getCategories,
  getStatuses,
  createItem,
  updateItem,
} from "./Api.js";

document.addEventListener("DOMContentLoaded", () => {
  // --- DOM ELEMENTS ---
  const itemsGrid = document.getElementById("items-grid");
  const loginBtn = document.getElementById("login-btn");
  const loginLink = document.getElementById("login-link");
  const logoutLink = document.getElementById("logout-btn");
  const homeLink = document.getElementById("home-link");
  const addItemLink = document.getElementById("add-item-link");

  const searchBox = document.getElementById("search-box");
  const categorySelect = document.getElementById("category-filter");
  const statusSelect = document.getElementById("status-filter");
  const applyFiltersBtn = document.getElementById("apply-filters-btn");

  const itemFormSection = document.getElementById("item-form-section");
  const itemForm = document.getElementById("item-form");
  const cancelItemBtn = document.getElementById("cancel-item-btn");

  // --- ADMIN STATE ---
  let isAdminLoggedIn = localStorage.getItem("isAdmin") === "true";

  // --- WATERMARK ---
  function updateUserDisplay() {
    const userName = localStorage.getItem("userName");
    let watermark = document.getElementById("username-watermark");
    if (watermark) watermark.remove();

    if (userName && isAdminLoggedIn) {
      watermark = document.createElement("div");
      watermark.id = "username-watermark";
      watermark.textContent = `Logged in as: ${userName}`;
      Object.assign(watermark.style, {
        position: "fixed",
        bottom: "15px",
        right: "15px",
        background: "rgba(0,0,0,0.6)",
        color: "#fff",
        padding: "8px 12px",
        borderRadius: "6px",
        fontSize: "0.9rem",
        fontWeight: "bold",
        zIndex: "1000",
        boxShadow: "0 0 8px rgba(0,0,0,0.3)",
        pointerEvents: "none",
      });
      document.body.appendChild(watermark);
    }
  }

  // --- LOAD ITEMS ---
  async function loadHomePage(searchText = "", categoryId = "", statusId = "") {
    let items = await getItems();

    // Search filter
    if (searchText) {
      const lowerText = searchText.toLowerCase();
      items = items.filter(
        (item) =>
          (item.title && item.title.toLowerCase().includes(lowerText)) ||
          (item.description &&
            item.description.toLowerCase().includes(lowerText))
      );
    }

    // Category filter
    if (categoryId) items = items.filter((i) => i.categoryId == categoryId);

    // Status filter
    if (statusId) items = items.filter((i) => i.statusId == statusId);

    itemsGrid.innerHTML = "";

    if (!items || items.length === 0) {
      itemsGrid.innerHTML = "<p>No items found.</p>";
      return;
    }

    items.forEach((item) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${item.photoUrl || "images/placeholder.png"}" alt="${
        item.title
      }">
        <div class="card-body">
          <h2>${item.title}</h2>
          <p>${
            item.description ? item.description.substring(0, 60) + "..." : ""
          }</p>
          <div class="card-actions"></div>
        </div>
      `;

      if (isAdminLoggedIn) {
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", async () => {
          if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
            await deleteItem(item.id);
            loadHomePage(
              searchBox.value,
              categorySelect.value,
              statusSelect.value
            );
          }
        });
        card.querySelector(".card-actions").appendChild(deleteBtn);
      }

      itemsGrid.appendChild(card);
    });

    updateUserDisplay();
    updateAdminUI();
  }

  // --- POPULATE FILTERS ---
  async function populateFilters() {
    const categories = await getCategories();
    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.name;
      categorySelect.appendChild(option);
      document
        .getElementById("item-category")
        .appendChild(option.cloneNode(true));
    });

    const statuses = await getStatuses();
    statuses.forEach((stat) => {
      const option = document.createElement("option");
      option.value = stat.id;
      option.textContent = stat.name;
      statusSelect.appendChild(option);
      document
        .getElementById("item-status")
        .appendChild(option.cloneNode(true));
    });
  }

  // --- LOGIN ---
  async function loginAdmin() {
    if (isAdminLoggedIn) return alert("You are already logged in!");

    const userName = prompt("Enter username:");
    const password = prompt("Enter password:");

    if (!userName || !password) return alert("Username and password required!");

    try {
      const response = await fetch("http://localhost:5152/api/Admins/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ UserName: userName, Password: password }),
      });

      if (!response.ok) return alert("Login failed: Invalid credentials");

      const data = await response.json();
      localStorage.setItem("isAdmin", data.isAdmin);
      localStorage.setItem("userName", userName);
      isAdminLoggedIn = true;

      alert(`Logged in as ${userName}`);
      loadHomePage(searchBox.value, categorySelect.value, statusSelect.value);
    } catch (err) {
      console.error(err);
      alert("Login failed. Please try again.");
    }
  }

  // --- LOGOUT ---
  function logoutAdmin() {
    if (!isAdminLoggedIn) return alert("You are not logged in!");
    if (!confirm("Are you sure you want to log out?")) return;

    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userName");
    isAdminLoggedIn = false;

    const watermark = document.getElementById("username-watermark");
    if (watermark) watermark.remove();

    alert("Logged out successfully!");
    loadHomePage();
  }

  // --- UPDATE ADMIN UI ---
  function updateAdminUI() {
    addItemLink.style.display = isAdminLoggedIn ? "inline-block" : "none";
    loginBtn.disabled = isAdminLoggedIn;
    loginLink.style.pointerEvents = isAdminLoggedIn ? "none" : "auto";
    loginLink.style.opacity = isAdminLoggedIn ? "0.5" : "1";
  }

  // --- SHOW ADD/EDIT FORM ---
  addItemLink.addEventListener("click", (e) => {
    e.preventDefault();
    if (!isAdminLoggedIn) return alert("You must be logged in as admin.");
    itemFormSection.style.display = "block";
    itemForm.reset();
  });

  cancelItemBtn.addEventListener("click", () => {
    itemFormSection.style.display = "none";
  });

  // --- ADD/EDIT ITEM SUBMISSION ---
  itemForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!isAdminLoggedIn) return alert("You must be logged in as admin.");

    const id = document.getElementById("item-id").value;
    const newItem = {
      title: document.getElementById("item-title").value,
      description: document.getElementById("item-description").value,
      photoUrl: document.getElementById("item-photo").value,
      categoryId: document.getElementById("item-category").value,
      statusId: document.getElementById("item-status").value,
      location: document.getElementById("item-location").value,
      contactInfo: document.getElementById("item-contact").value,
      dateReported: document.getElementById("item-date").value,
    };

    try {
      if (id) await updateItem(id, newItem);
      else await createItem(newItem);

      alert(id ? "Item updated!" : "Item created!");
      itemFormSection.style.display = "none";
      loadHomePage(searchBox.value, categorySelect.value, statusSelect.value);
    } catch (err) {
      console.error(err);
      alert("Failed to save item.");
    }
  });

  // --- EVENT LISTENERS ---
  homeLink.addEventListener("click", (e) => {
    e.preventDefault();
    loadHomePage();
  });
  loginBtn.addEventListener("click", loginAdmin);
  loginLink.addEventListener("click", (e) => {
    e.preventDefault();
    loginAdmin();
  });
  logoutLink.addEventListener("click", (e) => {
    e.preventDefault();
    logoutAdmin();
  });
  applyFiltersBtn.addEventListener("click", () => {
    loadHomePage(searchBox.value, categorySelect.value, statusSelect.value);
  });

  // --- INITIAL LOAD ---
  populateFilters();
  loadHomePage();
  updateAdminUI();
  updateUserDisplay();
});
