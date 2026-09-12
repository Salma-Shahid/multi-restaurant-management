const Booking = require("../models/Booking");
const Restaurant = require("../models/Restaurant");
const Table = require("../models/Table");

// @desc    Create a new table booking (Strict Overlap Prevention)
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const {
      restaurantId,
      tableId,
      partySize,
      bookingDate,
      startTime,
      endTime,
      notes,
    } = req.body;
    const customerId = req.user.id; //get id from JWT Token

    // 1: Check if the table exists and is active
    const table = await Table.findById(tableId);
    if (!table || !table.isActive) {
      return res.status(404).json({
        success: false,
        message: "Table not found or not active for booking.",
      });
    }

    // 2.Do Check that party size is not exceeding table capacity
    if (table.capacity < partySize) {
      return res.status(400).json({
        success: false,
        message: `This table can only accommodate ${table.capacity} guests.`,
      });
    }

    // 3. STRICT DOUBLE-BOOKING CHECK (Overlapping Slots Logic)
    // Condition: If new booking's startTime < existing booking's endTime AND new booking's endTime > existing booking's startTime, then it's an overlap.
    // Overlap mathematical condition: (RequestedStartTime < ExistingEndTime) AND (RequestedEndTime > ExistingStartTime)
    const overlappingBooking = await Booking.findOne({
      tableId: tableId,
      bookingDate: new Date(bookingDate),
      status: { $in: ["pending", "confirmed"] }, // Sirf active/pending bookings check karein, cancelled ko ignore karein
      $and: [{ startTime: { $lt: endTime } }, { endTime: { $gt: startTime } }],
    });

    if (overlappingBooking) {
      return res.status(409).json({
        success: false,
        message:
          "Conflict! This table is already booked for the selected time slot. Please choose a different table or time.",
      });
    }

    // 4. if everything is valid, create the booking
    const newBooking = await Booking.create({
      customerId,
      restaurantId,
      tableId,
      partySize,
      bookingDate,
      startTime,
      endTime,
      notes,
      status: "pending", // Initial status is pending,approval of admin required
    });

    res.status(201).json({
      success: true,
      data: newBooking,
      message:
        "Booking request is successfully saved. wait for Owner approval.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's personal bookings (for customers)
// @route   GET /api/bookings/my-bookings
exports.getCustomerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.user.id })
      .populate("restaurantId", "name address")
      .populate("tableId", "tableNumber");
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings for a restaurant (only for the restaurant owner)
// @route   GET /api/bookings/restaurant/:restaurantId
exports.getRestaurantBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      restaurantId: req.params.restaurantId,
    })
      .populate("customerId", "name email phone")
      .populate("tableId", "tableNumber");
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update booking status (Approve/Reject by Owner)
// @route   PUT /api/bookings/:id/status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'confirmed' ya 'cancelled' ya 'completed'
    const currentUserId = req.user?._id?.toString() || req.user?.id?.toString();

    if (!["confirmed", "cancelled", "completed"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status code" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    const restaurant = await Restaurant.findById(booking.restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant attached to this booking was not found.",
      });
    }

    // only restaurant owner can update the booking status
    if (restaurant.ownerId?.toString() !== currentUserId) {
      return res.status(401).json({
        success: false,
        message: "You are not the owner of this restaurant.",
      });
    }

    const table = await Table.findById(booking.tableId);
    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table attached to this booking was not found.",
      });
    }

    const capacity = Number(table.capacity) || 0;
    let seatsLeft = Number(table.availableSeats ?? capacity);
    if (!Number.isFinite(seatsLeft) || seatsLeft <= 0) {
      seatsLeft = capacity;
    }

    const previousStatus = booking.status;

    if (status === "confirmed" && previousStatus !== "confirmed") {
      if (seatsLeft < booking.partySize) {
        return res.status(400).json({
          success: false,
          message: `Not enough seats left on this table. Available seats: ${Math.max(0, seatsLeft)}`,
        });
      }

      seatsLeft = Math.max(0, seatsLeft - booking.partySize);
      table.availableSeats = seatsLeft;
    }

    if (status === "cancelled" && previousStatus === "confirmed") {
      seatsLeft = Math.min(capacity, seatsLeft + booking.partySize);
      table.availableSeats = seatsLeft;
    }

    if (status === "completed" && previousStatus === "confirmed") {
      table.availableSeats = Math.min(capacity, seatsLeft);
    }

    booking.status = status;
    await table.save();
    await booking.save();

    res.json({
      success: true,
      data: booking,
      message: `Booking status is successfully ${status} updated.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
