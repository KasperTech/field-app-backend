const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    startTime: {
      type: mongoose.Schema.Types.Date,
      default: Date.now(),
    },
    endTime: {
      type: mongoose.Schema.Types.Date,
      default: null,
    },
    markedLocations: [
      {
        latitude: { type: mongoose.Schema.Types.String },
        longitude: { type: mongoose.Schema.Types.String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Trip = mongoose.model("Trip", tripSchema, "trip");

module.exports = Trip;
