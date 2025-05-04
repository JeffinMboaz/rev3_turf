const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  username: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  turfname: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Turf",
    required: true
  },

  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },

  review: {
    type: String,
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
