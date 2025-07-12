import { getToken, protectPage, logout } from "./auth.js";

// Redirect if no token
protectPage();

// DOM elements
const nameField = document.getElementById("user-name");
const pointsField = document.getElementById("user-points");
const logoutBtn = document.getElementById("logout-btn");

// Load user data
async function loadUserInfo() {
  try {
    const res = await fetch("http://192.168.0.106:5050/api/auth/profile", {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      nameField.textContent = data.name;
      pointsField.textContent = data.points;
    } else {
      window.location.href = "login.html";
    }
  } catch (err) {
    console.error("Error fetching profile:", err);
    window.location.href = "login.html";
  }
}

// Logout logic
logoutBtn.addEventListener("click", logout);

// Load data when page loads
loadUserInfo();