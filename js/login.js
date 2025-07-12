import { BASE_URL } from "./config.js";
import { getToken } from "./auth.js";

document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("error-msg");

  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log("Login response data:", data);

    if (res.ok) {
      // Store token
      localStorage.setItem("token", data.token);

      // Decode token to check isAdmin
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      const isAdmin = payload.isAdmin;

      // Redirect based on role
      if (isAdmin) {
        window.location.href = "../html/admin-panel.html";
      } else {
        window.location.href = "../html/dashboard.html";
      }
    } else {
      errorMsg.textContent = data.message || "Login failed. Please try again.";
    }
  } catch (error) {
    errorMsg.textContent = "Network error. Please try again later.";
  }
});