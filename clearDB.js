const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/user");
const Item = require("./models/item");

async function clearCollections() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const userResult = await User.deleteMany({});
    const itemResult = await Item.deleteMany({});

    console.log(`🧍‍♀️ Users deleted: ${userResult.deletedCount}`);
    console.log(`👕 Items deleted: ${itemResult.deletedCount}`);

    await mongoose.disconnect();
    console.log("🔌 Disconnected from DB");
  } catch (err) {
    console.error("❌ Error clearing database:", err);
  }
}

clearCollections();
