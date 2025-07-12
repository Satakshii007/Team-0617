import { protectPage, getToken } from './auth.js';
import { BASE_URL } from './config.js';

protectPage();

const grid = document.getElementById("browse-grid");
const statusMsg = document.getElementById("status-msg");

async function fetchAllItems() {
  try {
    const res = await fetch(`${BASE_URL}/api/items/all`, {
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
        const card = document.createElement("div");
        card.className = "item-card";

        const imageSrc = item.images?.[0]
          ? `${BASE_URL}/${item.images[0].replace(/\\/g, "/")}`
          : "https://via.placeholder.com/300";

        card.innerHTML = `
          <img src="${imageSrc}" alt="${item.title}">
          <div class="item-info">
            <h3>${item.title}</h3>
            <p>Size: ${item.size}</p>
            <p>Type: ${item.type}</p>
            <p>Condition: ${item.condition}</p>
            <p>Tags: ${item.tags?.join(", ") || '--'}</p>
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

fetchAllItems();