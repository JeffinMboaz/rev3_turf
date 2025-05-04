//turfevent models
const mongoose = require("mongoose");

const turfeventSchema = new mongoose.Schema({
  turf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Turf",
    required: true,
  },
  turfname: { // 👈 Add this
    type: String,
    required: true,
  },
  events: [
    {
      name: { type: String, required: true },       // e.g., "Football"
      type: { type: String, required: true },       // "Half Court" or "Full Court"
      price: { type: Number, required: true },      // e.g., 800/hour
      img: { type: String }                         // URL or filename to upload on frontend
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Turfevent", turfeventSchema);
