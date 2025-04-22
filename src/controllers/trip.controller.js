const asyncHandler = require("../middlewares/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const Trip = require("../models/trip.model");
const User = require("../models/user.model");
const { getDistance } = require("../utils/helper");
const _ = require("lodash");

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

  const existingLocation = trip.locations[trip.locations.length - 1];

  let newDist = getDistance(
    existingLocation.latitude,
    existingLocation.longitude,
    latitude,
    longitude
  );

  newDist = Number(newDist) + trip.totalDistance;

  trip.endTime = new Date();
  trip.totalDistance = parseFloat(newDist).toFixed(2);
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

  const existingLocation = trip.locations[trip.locations.length - 1];

  let newDist = getDistance(
    existingLocation.latitude,
    existingLocation.longitude,
    latitude,
    longitude
  );

  newDist = Number(newDist) + trip.totalDistance;

  trip.locations.push({
    latitude,
    longitude,
    time: new Date(),
  });
  trip.totalDistance = parseFloat(newDist).toFixed(2);
  await trip.save();

  return res
    .status(200)
    .json(new ApiResponse(200, trip, "location added successfully"));
});

/**
 * Fetch all trips
 * @route [
 *  /api/v1/field-user/trip/
 * ]
 * @method GET
 * @contentType application/json
 * @authentication true
 * @authorization false
 *
 */
exports.getAllTrips = asyncHandler(async (req, res) => {
  const { userId, table, page, limit } = req.query;
  const query = {};
  if (userId) {
    query.userId = userId;
  }
  if (table === "true") {
    let requestedPage = Number(page);
    let requestedLimit = Number(limit);

    requestedPage =
      _.isInteger(requestedPage) && requestedPage > 1 ? requestedPage : 1;
    requestedLimit =
      _.isInteger(requestedLimit) &&
      (requestedLimit > 0 || requestedLimit <= 25)
        ? requestedLimit
        : 50;

    const trips = await Trip.find(query)
      .skip((requestedPage - 1) * requestedLimit)
      .limit(requestedLimit);

    const totalCount = await Trip.countDocuments(query);

    const metaData = {
      page: requestedPage,
      limit: requestedLimit,
      total_results: totalCount,
      total_pages: Math.ceil(totalCount / requestedLimit),
    };

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { data: trips, metaData },
          "Trips fetched successfully"
        )
      );
  } else {
    const trips = await Trip.find(query).select("-locations");
    return res
      .status(200)
      .json(new ApiResponse(200, trips, "Trips fetched successfully"));
  }
});
