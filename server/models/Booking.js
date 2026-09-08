const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  tableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Table",
    required: true,
  },
  partySize: { type: Number, required: true },
  bookingDate: { type: Date, required: true },
  startTime: { type: String, required: true }, // Format: "18:00" (24 Hour format string comparison ke liye aasan hai)
  endTime: { type: String, required: true }, // Format: "20:00"
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending",
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", BookingSchema);
