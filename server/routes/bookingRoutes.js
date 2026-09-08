const express = require("express");
const router = express.Router();
const {
  createBooking,
  getCustomerBookings,
  getRestaurantBookings,
  updateBookingStatus,
} = require("../controllers/bookingController");
const { protect, authorize } = require("../middleware/auth");

// Protected Customer Routes
router.post("/", protect, authorize("Customer"), createBooking);
router.get("/my-bookings", protect, authorize("Customer"), getCustomerBookings);

// Protected Owner Routes
router.get(
  "/restaurant/:restaurantId",
  protect,
  authorize("Owner"),
  getRestaurantBookings,
);
router.put("/:id/status", protect, authorize("Owner"), updateBookingStatus);

module.exports = router;
