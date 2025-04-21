const express = require("express");
const router = express.Router();

const {authorizeUser} = require("../../middlewares/authorizeUser");

const {startFieldTrip, endFieldTrip} = require("../../controllers/trip.controller")

router.route('/start').post(authorizeUser, startFieldTrip);
router.route('/:tripId/end').post(authorizeUser, endFieldTrip);


module.exports = router