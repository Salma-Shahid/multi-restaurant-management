const express = require("express");
const router = express.Router();
const { getRecommendations } = require("../controllers/aiController");
const { protect } = require("../middleware/auth");

// @route   POST /api/ai/recommend
// @desc    Get AI-based recommendations for restaurants or dishes
// @access  Private
router.post("/recommend", protect, getRecommendations);

module.exports = router;
