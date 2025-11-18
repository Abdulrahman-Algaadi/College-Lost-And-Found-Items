// auth.js
import { getItems } from "./Api.js"; // optional, used only if you want to preload something

const ADMIN_LOGIN_ENDPOINT = "http://localhost:5152/api/Admins/Login";

let _onAuthChange = [];

/**
 * Public helpers
 */
export function isAdmin() {
  return localStorage.getItem("isAdmin") === "true";
}
export function getUserName() {
  return localStorage.getItem("userName") || null;
}
export function onAuthChange(cb) {
  if (typeof cb === "function") _onAuthChange.push(cb);
}

/**
 * Update UI pieces that are common across pages:
 * - show/hide admin-only links with class "admin-only"
 * - show/hide logout button with id "logout-btn"
 * - display watermark
 * - handle hamburger toggle (nav has .nav-links and .hamburger)
 */
export function initAuthUI() {
  document.addEventListener("DOMContentLoaded", () => {
    updateAuthUI();
    attachNavbarToggle();
  });
}

function notifyAuthChange() {
  _onAuthChange.forEach((cb) => {
    try {
      cb(isAdmin());
    } catch (e) {
      console.error(e);
    }
  });
}

/* --- Login function (prompts like before) --- */
export async function loginAdmin() {
  if (isAdmin()) return alert("You are already logged in!");

  const userName = prompt("Enter username:");
  const password = prompt("Enter password:");

  if (!userName || !password) return alert("Username and password required!");

  try {
    const response = await fetch(ADMIN_LOGIN_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ UserName: userName, Password: password }),
    });

    if (!response.ok) return alert("Login failed: Invalid credentials");

    const data = await response.json();
    // backend should return something like { isAdmin: true }
    localStorage.setItem("isAdmin", data.isAdmin ? "true" : "false");
    localStorage.setItem("userName", userName);
    updateAuthUI();
    notifyAuthChange();
    alert(`Logged in as ${userName}`);
  } catch (err) {
    console.error("loginAdmin error:", err);
    alert("Login failed. Please try again.");
  }
}

export function logoutAdmin() {
  if (!isAdmin()) return alert("You are not logged in!");
  if (!confirm("Are you sure you want to log out?")) return;
  localStorage.removeItem("isAdmin");
  localStorage.removeItem("userName");
  updateAuthUI();
  notifyAuthChange();
  alert("Logged out successfully!");
}

/* --- UI helpers --- */
function updateAuthUI() {
  const adminOnlyEls = document.querySelectorAll(".admin-only");
  adminOnlyEls.forEach((el) => {
    el.style.display = isAdmin() ? "" : "none";
  });

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) logoutBtn.style.display = isAdmin() ? "" : "none";

  // disable/hide login controls (if any) that have id "login-btn" or class "login-trigger"
  const loginBtns = document.querySelectorAll("#login-btn, .login-trigger");
  loginBtns.forEach((el) => {
    el.style.display = isAdmin() ? "none" : "";
  });

  updateUserWatermark();
}

function updateUserWatermark() {
  const existing = document.getElementById("username-watermark");
  if (existing) existing.remove();

  if (isAdmin() && getUserName()) {
    const w = document.createElement("div");
    w.id = "username-watermark";
    w.textContent = `Logged in as: ${getUserName()}`;
    Object.assign(w.style, {
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
    document.body.appendChild(w);
  }
}

/* --- responsive nav hamburger toggle --- */
function attachNavbarToggle() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  // close when clicking outside (mobile)
  document.addEventListener("click", (e) => {
    if (hamburger.contains(e.target) || navLinks.contains(e.target)) return;
    navLinks.classList.remove("open");
  });
}
