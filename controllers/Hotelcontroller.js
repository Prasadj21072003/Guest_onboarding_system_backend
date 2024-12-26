const Hotel = require("../models/Hotel");
var QRCode = require("qrcode");
const path = require("path");
const crypto = require("crypto");

// Get all hotels
exports.getAllHotels = async (req, res) => {
  if (req?.user) {
    try {
      const hotels = await Hotel.find();
      res.status(200).json(hotels);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

// Get hotel by ID
exports.getHotelById = async (req, res) => {
  if (req?.user) {
    try {
      const hotel = await Hotel.findById(req.params.id);
      if (!hotel) return res.status(404).json({ message: "Hotel not found" });
      res.status(200).json(hotel);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

//Create a hotel
exports.createHotel = async (req, res) => {
  if (req?.user) {
    try {
      console.log;
      var correctpath = path.join(__dirname, "..", "public", "QR");
      randomName = crypto.randomBytes(12).toString("hex");
      var logo = req.file.filename;
      const { name, address, guestpanelemail, guestpanelpass } = req.body;
      const newhotel = new Hotel({
        logo,
        name,
        address,
        guestpanelemail,
        guestpanelpass,
      });

      QRCode.toFile(
        path.join(correctpath, `${randomName}.png`),
        `http://localhost:5173/guestform/${newhotel._id}`,
        (err) => {
          if (err) throw err;
        }
      );

      newhotel.qr = `${randomName}.png`;
      await newhotel.save();
      res.status(201).json(newhotel);
    } catch (error) {
      res.status(500).json({ message: "Error creating Hotel", error });
    }
  }
};

// Delete hotel by ID
exports.deleteHotelById = async (req, res) => {
  if (req?.user) {
    try {
      const hotel = await Hotel.findByIdAndDelete(req.params.id);
      if (!hotel) return res.status(404).json({ message: "Hotel not found" });
      res.status(200).json({ message: "Hotel deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

// Update hotel by ID
exports.updateHotelById = async (req, res) => {
  if (req?.user) {
    {
      try {
        const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
        });
        if (!hotel) return res.status(404).json({ message: "Hotel not found" });
        res.status(200).json(hotel);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  }
};
