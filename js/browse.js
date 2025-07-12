import { protectPage, getToken } from './auth.js';

protectPage();

const BASE_URL = "http://localhost:3000"; // your API base
const grid = document.getElementById("browse-grid");
const statusMsg = document.getElementById("status-msg");

async function fetchApprovedItems() {
  try {
    const res = await fetch(`${BASE_URL}/api/items?status=Approved`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      if (data.length === 0) {
        grid.innerHTML = "<p>No items available at the moment.</p>";
        return;
      }

      data.forEach(item => {
        const card = document.createElement("a");
        card.className = "item-card";
        card.href = `item-detail.html?id=${item._id}`;

        card.innerHTML = `
          <img src="${item.images?.[0] || 'https://via.placeholder.com/300'}" alt="${item.title}">
          <div class="item-info">
            <h3>${item.title}</h3>
            <p>Size: ${item.size}</p>
            <p>Type: ${item.type}</p>
            <span class="status">Available</span>
          </div>
        `;

        grid.appendChild(card);
      });
    } else {
      statusMsg.textContent = data.message || "Failed to load items.";
    }
  } catch (err) {
    console.error("Error loading items:", err);
    statusMsg.textContent = "Network error.";
  }
}

fetchApprovedItems();
