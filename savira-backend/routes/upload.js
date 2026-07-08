const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/auth");
const { upload, uploadToCloudinary, cloudinary } = require("../config/cloudinary");

// Upload multiple images (up to 10)
router.post(
  "/images",
  protect,
  adminOnly,
  upload.array("images", 10),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0)
        return res.status(400).json({ message: "No files uploaded" });

      const uploads = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.buffer))
      );

      const urls = uploads.map((result) => result.secure_url);
      res.json({ urls });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Delete image by public_id
router.delete("/image", protect, adminOnly, async (req, res) => {
  try {
    const { publicId } = req.body;
    if (!publicId) return res.status(400).json({ message: "publicId required" });
    await cloudinary.uploader.destroy(publicId);
    res.json({ message: "Image deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
