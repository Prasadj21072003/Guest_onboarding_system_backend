const verify = require("../verify");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const express = require("express");
const {
  getAllHotels,
  getHotelById,
  createHotel,
  deleteHotelById,
  updateHotelById,
} = require("../controllers/Hotelcontroller");

const router = express.Router();

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    crypto.randomBytes(12, function (err, name) {
      const fn = name.toString("hex") + path.extname(file.originalname);
      cb(null, fn);
    });
  },
});

const upload = multer({ storage: storage });

router.get("/", verify, getAllHotels);
router.get("/:id", verify, getHotelById);
router.post("/", verify, upload.single("image"), createHotel);
router.delete("/:id", verify, deleteHotelById);
router.put("/:id", verify, updateHotelById);

module.exports = router;
