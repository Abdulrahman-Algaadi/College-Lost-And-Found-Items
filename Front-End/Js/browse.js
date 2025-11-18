// browse.js
import { getItems, deleteItem, getCategories, getStatuses } from "./Api.js";
import {
  isAdmin,
  onAuthChange,
  initAuthUI,
  loginAdmin,
  logoutAdmin,
} from "./auth.js";

initAuthUI();

document.addEventListener("DOMContentLoaded", () => {
  const itemsGrid =
    document.getElementById("items-grid") ||
    document.getElementById("items-container") ||
    document.querySelector(".grid");
  const searchBox = document.getElementById("search-box");
  const categorySelect = document.getElementById("category-filter");
  const statusSelect = document.getElementById("status-filter");
  const applyFiltersBtn = document.getElementById("apply-filters-btn");

  const loginBtn = document.getElementById("login-btn");
  const loginLink = document.getElementById("login-link");
  const logoutLink = document.getElementById("logout-btn");
  const addItemLink = document.getElementById("add-item-link"); // optional

  if (loginBtn) loginBtn.addEventListener("click", loginAdmin);
  if (loginLink)
    loginLink.addEventListener("click", (e) => {
      e.preventDefault();
      loginAdmin();
    });
  if (logoutLink)
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      logoutAdmin();
    });

  onAuthChange(() => {
    renderItems(); // re-render so admin buttons show/hide
  });

  applyFiltersBtn?.addEventListener("click", () => {
    renderItems();
  });

  searchBox?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") renderItems();
  });

  // populate filters and initial render
  populateFilters();
  renderItems();

  async function populateFilters() {
    try {
      const cats = await getCategories();
      if (categorySelect) {
        categorySelect.innerHTML = `<option value="">All Categories</option>`;
        cats.forEach((c) => {
          const opt = document.createElement("option");
          opt.value = c.id;
          opt.textContent = c.name;
          categorySelect.appendChild(opt);
        });
      }
      const catTarget = document.getElementById("item-category");
      if (catTarget) {
        catTarget.innerHTML = `<option value="">Select category</option>`;
        cats.forEach((c) => {
          const opt = document.createElement("option");
          opt.value = c.id;
          opt.textContent = c.name;
          catTarget.appendChild(opt);
        });
      }

      const stats = await getStatuses();
      if (statusSelect) {
        statusSelect.innerHTML = `<option value="">All Statuses</option>`;
        stats.forEach((s) => {
          const opt = document.createElement("option");
          opt.value = s.id;
          opt.textContent = s.name;
          statusSelect.appendChild(opt);
        });
      }
      const statusTarget = document.getElementById("item-status");
      if (statusTarget) {
        statusTarget.innerHTML = `<option value="">Select status</option>`;
        stats.forEach((s) => {
          const opt = document.createElement("option");
          opt.value = s.id;
          opt.textContent = s.name;
          statusTarget.appendChild(opt);
        });
      }
    } catch (err) {
      console.error("populateFilters error:", err);
    }
  }

  async function renderItems() {
    if (!itemsGrid) return;
    const search = (searchBox?.value || "").trim().toLowerCase();
    const cat = categorySelect?.value || "";
    const stat = statusSelect?.value || "";

    itemsGrid.innerHTML = "<p>Loading...</p>";

    try {
      let items = await getItems();

      if (search) {
        items = items.filter(
          (item) =>
            (item.title && item.title.toLowerCase().includes(search)) ||
            (item.description &&
              item.description.toLowerCase().includes(search))
        );
      }
      if (cat)
        items = items.filter((i) => String(i.categoryId) === String(cat));
      if (stat)
        items = items.filter((i) => String(i.statusId) === String(stat));

      if (!items || items.length === 0) {
        itemsGrid.innerHTML = "<p>No items found.</p>";
        return;
      }

      itemsGrid.innerHTML = "";
      items.forEach((item) => {
        const card = document.createElement("div");
        card.className = "item-card";
        card.innerHTML = `
          <img src="${
            item.photoUrl || "images/placeholder.png"
          }" alt="${escapeHtml(item.title || "")}">
          <div class="card-body">
            <h3>${escapeHtml(item.title || "")}</h3>
            <p>${escapeHtml((item.description || "").substring(0, 80))}${
          item.description && item.description.length > 80 ? "..." : ""
        }</p>
            <div class="meta">
              <small>${item.location || ""}</small>
              <small>${
                item.dateReported
                  ? new Date(item.dateReported).toLocaleDateString()
                  : ""
              }</small>
            </div>
            <div class="card-actions"></div>
          </div>
        `;

        const actions = card.querySelector(".card-actions");

        // View details button (optional)
        const viewBtn = document.createElement("button");
        viewBtn.textContent = "View";
        viewBtn.addEventListener("click", () => {
          // could open a modal or navigate to details page; for now, just alert
          alert(`${item.title}\n\n${item.description || ""}`);
        });
        actions.appendChild(viewBtn);

        // If admin, add Edit + Delete
        if (isAdmin()) {
          const editBtn = document.createElement("button");
          editBtn.textContent = "Edit";
          editBtn.addEventListener("click", () => {
            // navigate to admin page with query param
            window.location.href = `admin.html?edit=${item.id}`;
          });
          actions.appendChild(editBtn);

          const deleteBtn = document.createElement("button");
          deleteBtn.textContent = "Delete";
          deleteBtn.addEventListener("click", async () => {
            if (!confirm(`Delete "${item.title}"?`)) return;
            try {
              await deleteItem(item.id);
              renderItems();
            } catch (err) {
              alert("Delete failed.");
            }
          });
          actions.appendChild(deleteBtn);
        }

        itemsGrid.appendChild(card);
      });
    } catch (err) {
      console.error("renderItems error:", err);
      itemsGrid.innerHTML = "<p>Failed to load items.</p>";
    }
  }

  // simple HTML escaper
  function escapeHtml(str) {
    return str.replace(
      /[&<>"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[m])
    );
  }
});
