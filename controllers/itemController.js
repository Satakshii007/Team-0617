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

// Get all approved items (or all items if needed)
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).json({ message: "Failed to fetch items" });
  }
};

// Get all items for admin with optional status filter
exports.getItemsForAdmin = async (req, res) => {
  try {
    const status = req.query.status;
    const filter = status && status !== "All" ? { status } : {};
    const items = await Item.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("Error fetching admin items:", err);
    res.status(500).json({ message: "Failed to fetch items" });
  }
};

exports.updateItemStatus = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!item) return res.status(404).json({ message: "Item not found" });

    res.json({ message: "Status updated", item });
  } catch (err) {
    console.error("Failed to update status:", err);
    res.status(500).json({ message: "Failed to update item status" });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("Failed to delete item:", err);
    res.status(500).json({ message: "Failed to delete item" });
  }
};

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
      images: imagePaths,
      status: "Pending"  // ✅ Explicit default status
    });

    await newItem.save();
    res.status(201).json({ message: "Item uploaded successfully" });
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ message: "Failed to upload item" });
  }
};



