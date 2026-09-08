const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Cloudinary credentials configure karein
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage engine define karein
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "restaurant_images", // Cloudinary par is naam ka folder banega
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage: storage });

module.exports = { upload, cloudinary };
