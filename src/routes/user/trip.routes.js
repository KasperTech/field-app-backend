const express = require("express");
const router = express.Router();

const { authorizeUser } = require("../../middlewares/authorizeUser");

const {
  startFieldTrip,
  fetchRunningTrip,
  endFieldTrip,
  addTripLocations,
  getAllTrips,
  getAllRoutes,
} = require("../../controllers/trip.controller");

router.route("/").get(authorizeUser, getAllTrips);
router.route("/start").post(authorizeUser, startFieldTrip);
router.route("/running").get(authorizeUser, fetchRunningTrip);
router.route("/:tripId/end").put(authorizeUser, endFieldTrip);
router
  .route("/:tripId/locations")
  .put(authorizeUser, addTripLocations)
  .get(authorizeUser, getAllRoutes);

module.exports = router;
