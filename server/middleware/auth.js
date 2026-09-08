const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Auth middleware login check karne ke liye
const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-passwordHash");
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, token failed" });
    }
  }
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token found" });
  }
};

// Role authorization check karne ke liye (E.g., sirf Owner access kar sake)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role (${req.user.role}) is not authorized to access this route`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
