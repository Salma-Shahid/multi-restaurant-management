const express = require("express");
const router = express.Router();
const {
  createRestaurant,
  getAllRestaurants,
  getMyRestaurant,
  updateRestaurant,
  deleteRestaurant,
  adminReviewRestaurant,
  getAdminAllRestaurants,
  addTable,
  getRestaurantTables,
} = require("../controllers/restaurantController");
const { protect, authorize } = require("../middleware/auth");
const { upload } = require("../config/cloudinary");

// Public Reads (Customer browse kar sakein)
router.get("/", getAllRestaurants);
router.get("/me", protect, authorize("Owner"), getMyRestaurant);
router.get("/:id/tables", getRestaurantTables);

// Owner Protections (CRUD functions)
router.post(
  "/",
  protect,
  authorize("Owner"),
  upload.single("image"),
  createRestaurant,
);
router.put(
  "/:id",
  protect,
  authorize("Owner"),
  upload.single("image"),
  updateRestaurant,
);
router.delete("/:id", protect, authorize("Owner"), deleteRestaurant);
router.post("/:id/tables", protect, authorize("Owner"), addTable);

// Super Admin Controls
router.get("/admin/all", protect, authorize("Admin"), getAdminAllRestaurants);
router.put("/:id/approve", protect, authorize("Admin"), adminReviewRestaurant);

module.exports = router;
