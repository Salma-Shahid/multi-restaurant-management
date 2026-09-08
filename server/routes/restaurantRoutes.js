const express = require("express");
const router = express.Router();
const {
  createRestaurant,
  getAllRestaurants,
  addTable,
  getRestaurantTables,
} = require("../controllers/restaurantController");
const { protect, authorize } = require("../middleware/auth");
const { upload } = require("../config/cloudinary");

// Public route: Koi bhi browse kar sakta hai
router.get("/", getAllRestaurants);
router.get("/:id/tables", getRestaurantTables);

// Private routes: Sirf registered owners ke liye
router.post(
  "/",
  protect,
  authorize("Owner"),
  upload.single("image"),
  createRestaurant,
);
router.post("/:id/tables", protect, authorize("Owner"), addTable);

module.exports = router;
