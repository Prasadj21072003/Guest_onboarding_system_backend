const Hotel = require("../models/Hotel");
var QRCode = require("qrcode");
const path = require("path");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
const streamifier = require("streamifier");
const Redis = require("ioredis");

//connecting redis
const redis = new Redis({
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
  port: process.env.REDIS_PORT,
});
redis.on("connect", () => {
  console.log("redis connected");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

// Get all hotels
exports.getAllHotels = async (req, res) => {
  if (req?.user) {
    try {
      const cachedhotels = await redis.get("hotelslist");

      if (cachedhotels) {
        console.log("Returning cached projects");
        return res.json(JSON.parse(cachedhotels));
      }
      const hotels = await Hotel.find();
      // Cache the result in Redis for future requests
      await redis.set("hotelslist", JSON.stringify(hotels));
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
      let logoname = req.file.filename;
      let logopath = req.file.path;
      const logoUpload = await cloudinary.uploader.upload(logopath, {
        public_id: `${logoname}-logo`,
      });
      const logo = logoUpload.secure_url;
      const { name, address, guestpanelemail, guestpanelpass } = req.body;
      const newhotel = new Hotel({
        logo,
        name,
        address,
        guestpanelemail,
        guestpanelpass,
      });

      // Generate QR Code Buffer
      const qrBuffer = await QRCode.toBuffer(
        `https://coruscating-centaur-4a62e3.netlify.app/guestform/${newhotel._id}`
      );

      try {
        let uploadstream = cloudinary.uploader.upload_stream(function (
          result,
          error
        ) {
          if (error !== undefined) {
            console.log("error " + error);
            res.json(error);
          } else if (result !== undefined) {
            const func = async () => {
              newhotel.qr = `${result.secure_url}`;
              await newhotel.save();
              // Clear Redis cache after saving the new hotel
              const cachedhotels = await redis.get("hotelslist");
              if (cachedhotels) {
                await redis.del("hotelslist");
                console.log("Redis cache cleared for key: hotelslist");
              }
              res.status(201).json(newhotel);
            };

            func();
          }
        });

        streamifier.createReadStream(qrBuffer).pipe(uploadstream);
      } catch (error) {
        console.log(error);
      }
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
      const cachedhotels = await redis.get("hotelslist");
      if (cachedhotels) {
        await redis.del("hotelslist");
        console.log("Redis cache cleared for key: hotelslist");
      }
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
        const cachedhotels = await redis.get("hotelslist");
        if (cachedhotels) {
          await redis.del("hotelslist");
          console.log("Redis cache cleared for key: hotelslist");
        }
        res.status(200).json(hotel);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  }
};
