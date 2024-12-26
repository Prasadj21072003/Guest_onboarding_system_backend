const express = require("express");
const mongoose = require("mongoose");
const hotelRoutes = require("./routes/Hotelroutes");
const guestRoutes = require("./routes/Guestroutes");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

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
