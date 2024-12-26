const verify = require("../verify");
const express = require("express");
const {
  getAllGuests,
  getGuestById,
  createGuest,
  updateGuestById,
  fetchGuestsByhotelId,
} = require("../controllers/Guestcontroller");

const router = express.Router();

router.get("/", verify, getAllGuests);
router.post("/", createGuest);
router.get("/:id", verify, getGuestById);
router.get("/byhotelid/:id", verify, fetchGuestsByhotelId);
router.put("/:id", verify, updateGuestById);

module.exports = router;
