const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middleware/auth");

const {
  uploadItem,
  getMyItems,
  getAllItems,
  getItemsForAdmin,   // ✅ required for admin panel
  updateItemStatus,   // ✅ for approve/reject
  deleteItem          // ✅ for delete
} = require("../controllers/itemController");

const isAdmin = require("../middleware/isAdmin");

// Admin-only routes
router.get("/admin", auth, isAdmin, getItemsForAdmin);
router.put("/:id/status", auth, isAdmin, updateItemStatus);
router.delete("/:id", auth, isAdmin, deleteItem);


// Storage config for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// ------------------ USER ROUTES ------------------

// Upload a new item
router.post("/add", auth, upload.array("images", 5), uploadItem);

// Get all items of logged-in user
router.get("/my", auth, getMyItems);

// Browse all approved items (for home/browse page)
router.get("/all", auth, getAllItems);


// ------------------ ADMIN ROUTES ------------------

// ✅ Get all items (filter by status: Pending, Approved, Rejected)
router.get("/admin", auth, getItemsForAdmin);

// ✅ Update status of an item (Approve / Reject)
router.put("/:id/status", auth, updateItemStatus);

// ✅ Delete an item
router.delete("/:id", auth, deleteItem);

module.exports = router;
