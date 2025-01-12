/* These lines of code are importing necessary modules and files for setting up a Node.js server using
Express framework and MongoDB with Mongoose. */
const express = require("express");
const mongoose = require("mongoose");
const hotelRoutes = require("./routes/Hotelroutes");
const guestRoutes = require("./routes/Guestroutes");
const cors = require("cors");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary").v2;
const Redis = require("ioredis");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

//connecting redis
export const redis = new Redis({
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
  port: process.env.REDIS_PORT,
});

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

/* The `mongoose.connect()` function is establishing a connection to a MongoDB database using Mongoose. */
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => console.log("MongoDB connected!"));
mongoose.connection.on("error", (err) =>
  console.log("DB connection error:", err)
);

app.use(express.json());

app.use("/api/hotels", hotelRoutes);
app.use("/api/guests", guestRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
