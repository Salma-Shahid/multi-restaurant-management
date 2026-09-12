const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  changePassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.put("/change-password", protect, changePassword);

module.exports = router;
