const express = require("express");
const router = express.Router();

const { authorizeUser } = require("../../middlewares/authorizeUser");

const {
  startFieldTrip,
  endFieldTrip,
  addTripLocations,
  getAllTrips,
} = require("../../controllers/trip.controller");

router.route("/").get(authorizeUser, getAllTrips);
router.route("/start").post(authorizeUser, startFieldTrip);
router.route("/:tripId/end").put(authorizeUser, endFieldTrip);
router.route("/:tripId/locations").put(authorizeUser, addTripLocations);

module.exports = router;
