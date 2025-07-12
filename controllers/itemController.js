const Item = require("../models/item");

// Upload a new item
exports.uploadItem = async (req, res) => {
  try {
    const imagePaths = req.files.map(file => file.path);

    const newItem = new Item({
      userId: req.userId,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      type: req.body.type,
      size: req.body.size,
      condition: req.body.condition,
      tags: req.body.tags.split(",").map(tag => tag.trim()),
      images: imagePaths
    });

    await newItem.save();
    res.status(201).json({ message: "Item uploaded successfully" });
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ message: "Failed to upload item" });
  }
};

// Get all items uploaded by the logged-in user
exports.getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("Failed to get user items:", err);
    res.status(500).json({ message: "Failed to fetch items" });
  }
};

// ✅ Get one item by its ID
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    res.json(item);
  } catch (err) {
    console.error("Error fetching item by ID:", err);
    res.status(500).json({ message: "Server error" });
  }
};
