const Restaurant = require("../models/Restaurant");
const Table = require("../models/Table");

// @desc    Create a new restaurant (only for owners)
// @route   POST /api/restaurants
exports.createRestaurant = async (req, res) => {
  try {
    const {
      name,
      description,
      cuisine,
      address,
      phone,
      openingTime,
      closingTime,
    } = req.body;
    const ownerId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Restaurant image uploading is mandatory for profile creation.",
      });
    }

    const newRestaurant = await Restaurant.create({
      ownerId,
      name,
      description,
      cuisine,
      address,
      phone,
      openingTime,
      closingTime,
      imageUrl: req.file.path,
      imagePublicId: req.file.filename,
      status: "pending", // initially set to pending for admin approval
    });

    res.status(201).json({ success: true, data: newRestaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all restaurants (only approved ones for public view)
// @route   GET /api/restaurants
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ status: "approved" });
    res.json({ success: true, data: restaurants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get the current owner's restaurant profile
// @route   GET /api/restaurants/me
exports.getMyRestaurant = async (req, res) => {
  try {
    const currentUserId = req.user?._id?.toString() || req.user?.id?.toString();
    const restaurant = await Restaurant.findOne({ ownerId: currentUserId });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "No restaurant found for this owner.",
      });
    }

    res.json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Restaurant Details (Owner Control CRUD)
// @route   PUT /api/restaurants/:id
exports.updateRestaurant = async (req, res) => {
  try {
    const currentUserId = req.user?._id?.toString() || req.user?.id?.toString();
    const {
      name,
      description,
      cuisine,
      address,
      phone,
      openingTime,
      closingTime,
    } = req.body;
    let restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant || restaurant.ownerId?.toString() !== currentUserId) {
      return res.status(401).json({
        success: false,
        message: "You are not the owner of this restaurant.",
      });
    }

    if (name !== undefined) restaurant.name = name;
    if (description !== undefined) restaurant.description = description;
    if (cuisine !== undefined) restaurant.cuisine = cuisine;
    if (address !== undefined) restaurant.address = address;
    if (phone !== undefined) restaurant.phone = phone;
    if (openingTime !== undefined) restaurant.openingTime = openingTime;
    if (closingTime !== undefined) restaurant.closingTime = closingTime;

    if (req.file) {
      restaurant.imageUrl = req.file.path;
      restaurant.imagePublicId = req.file.filename;
    }

    await restaurant.save();
    res.json({
      success: true,
      data: restaurant,
      message: "Restaurant configurations updated!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete Restaurant profile cluster tree (Owner Control CRUD)
// @route   DELETE /api/restaurants/:id
exports.deleteRestaurant = async (req, res) => {
  try {
    const currentUserId = req.user?._id?.toString() || req.user?.id?.toString();
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant || restaurant.ownerId?.toString() !== currentUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized profile removal attempt.",
      });
    }

    await Table.deleteMany({ restaurantId: req.params.id }); // Automatically clear child tables structure
    await restaurant.deleteOne();
    res.json({
      success: true,
      message: "Restaurant and tables completely deleted.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin Approval Logic
// @route   PUT /api/restaurants/:id/approve
exports.adminReviewRestaurant = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid approval status code assignment.",
      });
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    res.json({
      success: true,
      data: restaurant,
      message: `Restaurant status updated to: ${status}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get ALL restaurants for Super Admin Console List view
// @route   GET /api/restaurants/admin/all
exports.getAdminAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate(
      "ownerId",
      "name email",
    );
    res.json({ success: true, data: restaurants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a table to a restaurant (owner control)
// @route   POST /api/restaurants/:id/tables
exports.addTable = async (req, res) => {
  try {
    const currentUserId = req.user?._id?.toString() || req.user?.id?.toString();
    const { tableNumber, capacity } = req.body;
    const restaurantId = req.params.id;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant || restaurant.ownerId?.toString() !== currentUserId) {
      return res.status(401).json({
        success: false,
        message: "You are not the owner of this restaurant.",
      });
    }

    const normalizedCapacity = Number(capacity) || 0;
    const newTable = await Table.create({
      restaurantId,
      tableNumber,
      capacity: normalizedCapacity,
      availableSeats: normalizedCapacity,
    });

    res.status(201).json({ success: true, data: newTable });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all tables for a specific restaurant
// @route   GET /api/restaurants/:id/tables
exports.getRestaurantTables = async (req, res) => {
  try {
    const tables = await Table.find({
      restaurantId: req.params.id,
      isActive: true,
    });

    const normalizedTables = tables.map((table) => {
      const capacity = Number(table.capacity) || 0;
      const availableSeats = Number(table.availableSeats ?? capacity);

      return {
        ...table.toObject(),
        availableSeats:
          availableSeats > 0 && availableSeats <= capacity
            ? availableSeats
            : capacity,
      };
    });

    res.json({ success: true, data: normalizedTables });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
