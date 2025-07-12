// auth.js

// Get token from localStorage
export function getToken() {
  return localStorage.getItem("token");
}

// Check if the user is authenticated
export function isAuthenticated() {
  return !!getToken();
}

// Redirect to login if not authenticated
export function protectPage() {
  if (!isAuthenticated()) {
    window.location.href = "login.html";
  }
}

// Logout user
export function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}
// js/auth.js

export function getToken() {
  return localStorage.getItem("token");
}

export function isAuthenticated() {
  return !!getToken();
}

export function protectPage() {
  if (!isAuthenticated()) {
    window.location.href = "login.html";
  }
}

export function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}
