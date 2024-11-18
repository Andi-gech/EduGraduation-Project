// multerConfig.js
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Destination directory for uploaded files
  },
  filename: function (req, file, cb) {
    // Generate a unique filename using uuid
    const uniqueSuffix = uuidv4();
    // Extract file extension from original file name
    const fileExtension = path.extname(file.originalname);
    // Construct final filename
    cb(null, uniqueSuffix + fileExtension);
  },
});

// Initialize multer instance with storage options
const upload = multer({ storage: storage });

module.exports = upload;
