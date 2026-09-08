const Booking = require("../models/Booking");
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
    const customerId = req.user.id; // JWT Token se milega

    // 1. Pehle check karein ke kya table actual mein exist karta hai aur active hai
    const table = await Table.findById(tableId);
    if (!table || !table.isActive) {
      return res.status(404).json({
        success: false,
        message: "Table maujud nahi hai ya active nahi hai",
      });
    }

    // 2. Check karein ke table ki capacity party size ke mutabiq sahi hai ya nahi
    if (table.capacity < partySize) {
      return res.status(400).json({
        success: false,
        message: `Yeh table chota hai. Is table ki capacity sirf ${table.capacity} logo ki hai.`,
      });
    }

    // 3. STRICT DOUBLE-BOOKING CHECK (Overlapping Slots Logic)
    // Condition: Agar naya slot pehle se booked slot ke darmiyan overlap kare
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
          "Conflict! Yeh table is time slot ke liye pehle se book ho chuka hai. Khas taur par koi doosra table ya time select karein.",
      });
    }

    // 4. Agar koi overlap nahi mila, toh booking request save karein
    const newBooking = await Booking.create({
      customerId,
      restaurantId,
      tableId,
      partySize,
      bookingDate,
      startTime,
      endTime,
      notes,
      status: "pending", // Initial status owner ki approval ke liye pending hoga
    });

    res.status(201).json({
      success: true,
      data: newBooking,
      message:
        "Booking request successfully save ho gayi hai. Owner ki approval ka intezar karein.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's personal bookings (Customers ke liye)
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

// @desc    Get all bookings for a restaurant (Owner ke liye)
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

    if (!["confirmed", "cancelled", "completed"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status code" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking nahi mili" });
    }

    // Status update karein
    booking.status = status;
    await booking.save();

    res.json({
      success: true,
      data: booking,
      message: `Booking status successfully ${status} ho gaya hai.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
