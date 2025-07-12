
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
