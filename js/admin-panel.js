import { getToken, protectPage } from './auth.js';
import { BASE_URL } from './config.js';

protectPage();

// 🔒 Redirect non-admins to dashboard
function checkAdminAccess() {
  const token = getToken();
  if (!token) {
    window.location.href = "../html/login.html";
    return;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.isAdmin) {
      alert("Access denied: Admins only.");
      window.location.href = "../html/dashboard.html";
    }
  } catch (err) {
    console.error("Invalid token", err);
    window.location.href = "../html/login.html";
  }
}

checkAdminAccess();

const grid = document.getElementById("admin-grid");
const statusFilter = document.getElementById("status-filter");
const statusMsg = document.getElementById("status-msg");

async function fetchItems(filter = "Pending") {
  grid.innerHTML = "Loading...";

  try {
    const res = await fetch(`${BASE_URL}/api/items/admin?status=${filter}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      if (data.length === 0) {
        grid.innerHTML = "<p>No items found.</p>";
        return;
      }

      grid.innerHTML = "";
      data.forEach(item => {
        const card = document.createElement("div");
        card.className = "item-card";

        const imageSrc = item.images?.[0]
          ? `${BASE_URL}/${item.images[0].replace(/\\/g, "/")}`
          : "https://via.placeholder.com/300";

        card.innerHTML = `
          <img src="${imageSrc}" alt="${item.title}" />
          <div class="item-info">
            <h3>${item.title}</h3>
            <p>Size: ${item.size}</p>
            <p>Status: ${item.status}</p>
            <div class="admin-actions">
              <button class="approve-btn" data-id="${item._id}">Approve</button>
              <button class="reject-btn" data-id="${item._id}">Reject</button>
              <button class="delete-btn" data-id="${item._id}">Delete</button>
            </div>
          </div>
        `;

        grid.appendChild(card);
      });

      addAdminListeners();
    } else {
      statusMsg.textContent = "Failed to load items.";
    }
  } catch (err) {
    statusMsg.textContent = "Network error.";
  }
}

function addAdminListeners() {
  document.querySelectorAll(".approve-btn").forEach(btn =>
    btn.addEventListener("click", () => updateStatus(btn.dataset.id, "Approved"))
  );
  document.querySelectorAll(".reject-btn").forEach(btn =>
    btn.addEventListener("click", () => updateStatus(btn.dataset.id, "Rejected"))
  );
  document.querySelectorAll(".delete-btn").forEach(btn =>
    btn.addEventListener("click", () => deleteItem(btn.dataset.id))
  );
}

async function updateStatus(id, newStatus) {
  try {
    const res = await fetch(`${BASE_URL}/api/items/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({ status: newStatus })
    });

    const data = await res.json();
    if (res.ok) {
      fetchItems(statusFilter.value);
    } else {
      alert(data.message || "Update failed.");
    }
  } catch (err) {
    alert("Network error.");
  }
}

async function deleteItem(id) {
  if (!confirm("Are you sure you want to delete this item?")) return;

  try {
    const res = await fetch(`${BASE_URL}/api/items/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    const data = await res.json();
    if (res.ok) {
      fetchItems(statusFilter.value);
    } else {
      alert(data.message || "Delete failed.");
    }
  } catch (err) {
    alert("Network error.");
  }
}

// On page load
statusFilter.addEventListener("change", () => fetchItems(statusFilter.value));
fetchItems();