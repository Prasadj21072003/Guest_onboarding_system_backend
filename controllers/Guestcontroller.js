const Guest = require("../models/Guest");

// Get all guests
exports.getAllGuests = async (req, res) => {
  if (req?.user) {
    try {
      const guests = await Guest.find();
      res.status(200).json(guests);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

// Get guest by ID
exports.getGuestById = async (req, res) => {
  if (req?.user) {
    try {
      const guest = await Guest.findById(req.params.id);
      if (!guest) return res.status(404).json({ message: "Guest not found" });
      res.status(200).json(guest);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

//Create a guest
exports.createGuest = async (req, res) => {
  // if (req?.user) {
  try {
    const newguest = new Guest(req.body);
    await newguest.save();
    res.status(201).json(newguest);
  } catch (error) {
    res.status(500).json({ message: "Error creating Guest", error });
  }
  // }
};

// Update guest by ID
exports.updateGuestById = async (req, res) => {
  if (req?.user) {
    try {
      const guest = await Guest.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!guest) return res.status(404).json({ message: "Guest not found" });
      res.status(200).json(guest);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

//fetch guests by hotelid
exports.fetchGuestsByhotelId = async (req, res) => {
  if (req?.user) {
    try {
      var hotelid = req.params.id;
      const guest = await Guest?.find({ hotelid: hotelid });
      if (!guest) return res.status(404).json({ message: "Guest not found" });
      res.status(200).json(guest);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
