// admin.js
import {
  getCategories,
  getStatuses,
  createItem,
  updateItem,
  getItemById,
} from "./Api.js";
import { isAdmin, getUserName, initAuthUI, loginAdmin } from "./auth.js";

initAuthUI();

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const itemForm = document.getElementById("item-form");
  const cancelBtn = document.getElementById("cancel-item-btn");
  const idField = document.getElementById("item-id");
  const titleField = document.getElementById("item-title");
  const descField = document.getElementById("item-description");
  const photoField = document.getElementById("item-photo");
  const categoryField = document.getElementById("item-category");
  const statusField = document.getElementById("item-status");
  const locationField = document.getElementById("item-location");
  const contactField = document.getElementById("item-contact");
  const dateField = document.getElementById("item-date");

  if (!isAdmin()) {
    // Not admin — prompt to login
    if (confirm("Admin access required. Go to login?")) {
      window.location.href = "login.html";
    }
    return;
  }

  // populate categories + statuses
  populateControls();

  // If URL has ?edit=<id> then load that item into the form
  const params = new URLSearchParams(window.location.search);
  const editId = params.get("edit");
  if (editId) {
    loadItemIntoForm(editId);
  }

  // form submit
  itemForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = idField?.value;
    const payload = {
      title: titleField.value,
      description: descField.value,
      photoUrl: photoField.value,
      categoryId: categoryField.value,
      statusId: statusField.value,
      location: locationField.value,
      contactInfo: contactField.value,
      dateReported: dateField.value,
    };

    try {
      if (id) {
        await updateItem(id, payload);
        alert("Item updated!");
      } else {
        await createItem(payload);
        alert("Item created!");
      }
      // go back to browse page
      window.location.href = "browse.html";
    } catch (err) {
      console.error(err);
      alert("Failed to save item.");
    }
  });

  cancelBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "browse.html";
  });

  async function populateControls() {
    try {
      const cats = await getCategories();
      categoryField.innerHTML = `<option value="">Select category</option>`;
      cats.forEach((c) => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = c.name;
        categoryField.appendChild(opt);
      });

      const stats = await getStatuses();
      statusField.innerHTML = `<option value="">Select status</option>`;
      stats.forEach((s) => {
        const opt = document.createElement("option");
        opt.value = s.id;
        opt.textContent = s.name;
        statusField.appendChild(opt);
      });
    } catch (err) {
      console.error("populateControls error:", err);
    }
  }

  async function loadItemIntoForm(id) {
    try {
      const item = await getItemById(id);
      if (!item) {
        alert("Item not found.");
        return;
      }
      idField.value = item.id || "";
      titleField.value = item.title || "";
      descField.value = item.description || "";
      photoField.value = item.photoUrl || "";
      categoryField.value = item.categoryId || "";
      statusField.value = item.statusId || "";
      locationField.value = item.location || "";
      contactField.value = item.contactInfo || "";
      dateField.value = item.dateReported
        ? new Date(item.dateReported).toISOString().split("T")[0]
        : "";
    } catch (err) {
      console.error("loadItemIntoForm error:", err);
      alert("Failed to load item for editing.");
    }
  }
});
