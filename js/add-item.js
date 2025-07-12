import { protectPage, getToken } from './auth.js';
import { BASE_URL } from './config.js';

protectPage();

const form = document.getElementById("add-item-form");
const statusMsg = document.getElementById("status-msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  const files = document.getElementById("images").files;

  for (let i = 0; i < files.length; i++) {
    formData.append("images", files[i]);
  }

  formData.append("title", document.getElementById("title").value.trim());
  formData.append("description", document.getElementById("description").value.trim());
  formData.append("category", document.getElementById("category").value);
  formData.append("type", document.getElementById("type").value.trim());
  formData.append("size", document.getElementById("size").value.trim());
  formData.append("condition", document.getElementById("condition").value);
  formData.append("tags", document.getElementById("tags").value.trim());

  try {
    const res = await fetch(`${BASE_URL}/api/items/add`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        // Do NOT set 'Content-Type' header here for FormData
      },
      body: formData
    });

    const data = await res.json();

    if (res.ok) {
      statusMsg.style.color = "green";
      statusMsg.textContent = "Item added successfully!";
      form.reset();
    } else {
      statusMsg.style.color = "red";
      statusMsg.textContent = data.message || "Failed to list item.";
    }
  } catch (err) {
    console.error("Upload error:", err);
    statusMsg.style.color = "red";
    statusMsg.textContent = "Network error. Please try again.";
  }
});