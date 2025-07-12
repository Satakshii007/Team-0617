const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const {
  uploadItem,
  getMyItems,
  getAllItems,
  getItemsForAdmin,
  updateItemStatus,
  deleteItem,
  swapItem,
  redeemItem
} = require("../controllers/itemController");

// ----------- MULTER SETUP ------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });


// ----------- USER ROUTES ------------

// Upload a new item
router.post("/add", auth, upload.array("images", 5), uploadItem);

// Get items uploaded by the logged-in user
router.get("/my", auth, getMyItems);

// Get all approved items (for browse page)
router.get("/all", auth, getAllItems);

// Request to swap an item
router.post("/:id/swap", auth, swapItem);

// Request to redeem an item
router.post("/:id/redeem", auth, redeemItem);


// ----------- ADMIN ROUTES ------------

// Get all items (optionally filtered by status)
router.get("/admin", auth, isAdmin, getItemsForAdmin);

// Update status of an item (Approve/Reject)
router.put("/:id/status", auth, isAdmin, updateItemStatus);

// Delete an item
router.delete("/:id", auth, isAdmin, deleteItem);


module.exports = router;
