const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  description: { type: String },
  cuisine: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  openingTime: { type: String, required: true }, // Format: "09:00 AM"
  closingTime: { type: String, required: true }, // Format: "11:00 PM"
  imageUrl: { type: String },
  imagePublicId: { type: String },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "approved",
  },
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);
