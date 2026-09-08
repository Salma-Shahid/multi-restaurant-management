const express = require("express");
const router = express.Router();
const { getRecommendations } = require("../controllers/aiController");
const { protect } = require("../middleware/auth");

// Sirf logged-in customers hi recommendations le sakte hain
router.post("/recommend", protect, getRecommendations);

module.exports = router;
