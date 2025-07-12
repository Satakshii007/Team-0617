const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middleware/auth");
const {
  uploadItem,
  getMyItems,
  getItemById
} = require("../controllers/itemController");

// Storage config for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Route: Upload a new item
router.post("/add", auth, upload.array("images", 5), uploadItem);

// Route: Get all items of logged-in user
router.get("/my", auth, getMyItems);

// ✅ Route: Get one item by its ID
router.get("/:id", getItemById);

module.exports = router;
