const Restaurant = require("../models/Restaurant");
const Table = require("../models/Table");

// @desc    Create a new restaurant (Sirf Owners ke liye)
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
    const ownerId = req.user.id; // JWT Token se milega

    // Check karein agar image upload hui hai ya nahi
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Restaurant ki image upload karna lazmi hai",
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
      imageUrl: req.file.path, // Cloudinary secure URL
      imagePublicId: req.file.filename, // Delete karne ke liye zaroori hai
      status: "approved", // Default assignment ke mutabiq approved
    });

    res.status(201).json({ success: true, data: newRestaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all restaurants (Customers browse kar sakein)
// @route   GET /api/restaurants
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ status: "approved" });
    res.json({ success: true, data: restaurants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a table to a restaurant (Sirf Owner ke liye)
// @route   POST /api/restaurants/:id/tables
exports.addTable = async (req, res) => {
  try {
    const { tableNumber, capacity } = req.body;
    const restaurantId = req.params.id;

    // Verify karein ke yeh restaurant isi owner ka hai
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant || restaurant.ownerId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Aap is restaurant ke owner nahi hain",
      });
    }

    const newTable = await Table.create({
      restaurantId,
      tableNumber,
      capacity,
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
    res.json({ success: true, data: tables });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
