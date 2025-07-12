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

    if (res.ok) {
      localStorage.setItem("token", data.token); // Store token
      window.location.href = "dashboard.html"; // Redirect to dashboard
    } else {
      errorMsg.textContent = data.message || "Login failed. Please try again.";
    }
  } catch (error) {
    errorMsg.textContent = "Network error. Please try again later.";
  }
});
