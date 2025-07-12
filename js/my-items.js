import { protectPage, getToken } from './auth.js';
import { BASE_URL } from './config.js';

protectPage();

const grid = document.getElementById("items-grid");
const statusMsg = document.getElementById("status-msg");

async function fetchMyItems() {
  try {
    const res = await fetch(`${BASE_URL}/api/items/my`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      if (data.length === 0) {
        grid.innerHTML = "<p>You haven't listed any items yet.</p>";
        return;
      }

      data.forEach(item => {
        const card = document.createElement("div");
        card.className = "item-card";

        const imageSrc = item.images?.[0]
          ? `${BASE_URL}/${item.images[0].replace(/\\/g, "/")}`
          : "https://via.placeholder.com/300";

        card.innerHTML = `
       <img class="item-image" src="${imageSrc}" alt="${item.title}" />

  <div class="item-info">
            <h3>${item.title}</h3>
            <p><strong>Description:</strong> ${item.description}</p>
            <p><strong>Size:</strong> ${item.size}</p>
            <p><strong>Type:</strong> ${item.type}</p>
            <p><strong>Condition:</strong> ${item.condition}</p>
            <p><strong>Tags:</strong> ${item.tags?.join(", ") || "--"}</p>
            <p><strong>Points:</strong> ${item.points || '--'}</p>
            <p><strong>Status:</strong> <span class="status ${item.status}">${item.status}</span></p>

            <div class="item-actions">
              <button class="swap-btn" data-id="${item._id}">🔁 Swap</button>
              <button class="redeem-btn" data-id="${item._id}">💰 Redeem</button>
            </div>
          </div>
        `;

        // Add event listeners
        card.querySelector(".swap-btn").addEventListener("click", () => {
          handleSwap(item._id);
        });
        card.querySelector(".redeem-btn").addEventListener("click", () => {
          handleRedeem(item._id);
        });

        grid.appendChild(card);
      });
    } else {
      statusMsg.textContent = data.message || "Failed to load items.";
    }
  } catch (err) {
    console.error("Fetch error:", err);
    statusMsg.textContent = "Network error.";
  }
}

fetchMyItems();

async function handleSwap(itemId) {
  try {
    const res = await fetch(`${BASE_URL}/api/items/${itemId}/swap`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    const data = await res.json();
    alert(res.ok ? "Swap requested!" : data.message);
  } catch {
    alert("Network error");
  }
}

async function handleRedeem(itemId) {
  try {
    const res = await fetch(`${BASE_URL}/api/items/${itemId}/redeem`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    const data = await res.json();
    alert(res.ok ? "Redeemed successfully!" : data.message);
  } catch {
    alert("Network error");
  }
}