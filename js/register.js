// js/register.js
import { BASE_URL } from "./config.js";

document.getElementById("register-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("error-msg");

  errorMsg.textContent = "";

  if (!name || !email || !password) {
    errorMsg.textContent = "All fields are required.";
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    console.log("Register response:", data);

    if (res.ok) {
      localStorage.setItem("token", data.token);
      window.location.href = "../html/login.html";
    } else {
      errorMsg.textContent = data.message || "Registration failed. Please try again.";
    }
  } catch (error) {
    console.error("Network error:", error);
    errorMsg.textContent = "Network error. Please try again later.";
  }
});