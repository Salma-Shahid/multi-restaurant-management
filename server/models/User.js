const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  passwordHash: { type: String, required: true },
  phone: { type: String, required: true },
  role: {
    type: String,
    enum: ["Customer", "Owner", "Admin"],
    default: "Customer",
  }, // Admin role added here
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
