const asyncHandler = require("../middlewares/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const Trip = require("../models/trip.model");
const User = require("../models/user.model");

/**
 * Start Field trip
 * @route [
 *  /api/v1/field-user/trip/start
 * ]
 * @method POST
 * @contentType application/json
 * @authentication true
 * @authorization false
 *
 */
exports.startFieldTrip = asyncHandler(async (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    throw new ApiError(400, "Location is required!");
  }

  const user = await User.findById(req?.user?._id);
  if (!user) {
    throw new ApiError(400, "Invalid user");
  }

  const trip = await new Trip({
    userId: req?.user?._id,
    startTime: new Date(),
    locations: [{ latitude, longitude, time: new Date() }],
  }).save();

  if (!trip) {
    throw new ApiError(400, "Failed to start the trip!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, trip, "Trip started successfully"));
});

/**
 * End Field trip
 * @route [
 *  /api/v1/field-user/trip/:tripId/end
 * ]
 * @method PUT
 * @contentType application/json
 * @authentication true
 * @authorization false
 *
 */
exports.endFieldTrip = asyncHandler(async (req, res) => {
  const { tripId } = req.params;
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    throw new ApiError(400, "Location is required!");
  }

  const user = await User.findById(req?.user?._id);
  if (!user) {
    throw new ApiError(400, "Invalid user");
  }

  const trip = await Trip.findById(tripId);

  if (!trip) {
    throw new ApiError(400, "Failed to end the trip!");
  }

  if (trip.endTime) {
    throw new ApiError(400, "Trip already ended!");
  }

  trip.endTime = new Date();
  trip.locations.push({ latitude, longitude, time: new Date() });
  await trip.save();

  return res
    .status(200)
    .json(new ApiResponse(200, trip, "Trip ended successfully"));
});

/**
 * Add Field trip locations
 * @route [
 *  /api/v1/field-user/trip/:tripId/locations
 * ]
 * @method PUT
 * @contentType application/json
 * @authentication true
 * @authorization false
 *
 */

exports.addTripLocations = asyncHandler(async (req, res) => {
  const { tripId } = req.params;
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    throw new ApiError(400, "Location not gained!");
  }

  const user = await User.findById(req?.user?._id);
  if (!user) {
    throw new ApiError(400, "Invalid user");
  }

  const trip = await Trip.findById(tripId);

  if (!trip || trip.endTime) {
    throw new ApiError(400, "Trip not available!");
  }

  trip.locations.push({ latitude, longitude, time: new Date() });
  await trip.save();

  return res
    .status(200)
    .json(new ApiResponse(200, trip, "location added successfully"));
});
