// Save admin login state in localStorage
function setAdminLoggedIn(adminData) {
  localStorage.setItem("isAdmin", "true");
}

function logoutAdmin() {
  localStorage.removeItem("isAdmin");
  window.location.href = "index.html";
}

function isAdmin() {
  return localStorage.getItem("isAdmin") === "true";
}

// Render navbar dynamically
function renderNavbar() {
  const nav = document.getElementById("navbar");
  if (!nav) return;

  nav.innerHTML = `
        <a href="index.html">Home</a> | 
        <a href="browse-items.html">Browse Items</a> | 
        ${
          isAdmin()
            ? `<a href="admin.html">Dashboard</a> | <a href="#" id="logoutBtn">Logout</a>`
            : `<a href="login.html">Login</a>`
        }
    `;

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", logoutAdmin);
}
