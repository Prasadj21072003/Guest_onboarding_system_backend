const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema({
  hotelid: { type: String, required: true },
  logo: { type: String, required: true },
  hotelname: { type: String, required: true },
  hoteladdress: { type: String, required: true },
  name: { type: String, required: true },
  number: { type: Number, required: true },
  address: { type: String, required: true },
  purpose: { type: String, required: true, default: "Personal" },
  stayfrom: { type: String, required: true },
  stayto: { type: String, required: true },
  email: { type: String, required: true },
  proofno: { type: Number, required: true },
});

module.exports = mongoose.model("Guest", guestSchema);
