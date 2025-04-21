const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const tripRoutes = require('./trip.routes');

router.use('/auth', authRoutes);
router.use('/trip', tripRoutes);

module.exports = router