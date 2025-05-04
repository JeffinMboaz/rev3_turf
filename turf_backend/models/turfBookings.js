const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  turfname: { type: String, required: true },
  eventSelected: { type: String, required: true },
  courtType: {
    type: String,
    enum: ["Half Court", "Full Court"],
    required: true
  },
  hours: { type: Number, required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  price: { type: Number, required: true },

  // 👤 Booker (User/Admin/Manager)
  username: {
    role: {
      type: String,
      enum: ["user", "admin", "manager"],
      required: true,
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "username.role",
      required: true
    }
  },

  // 🏢 Turf owner
  createdBy: {
    role: {
      type: String,
      enum: ["Admin", "Manager"],
      required: true
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "createdBy.role",
      required: true
    }
  },

  status: {
    type: String,
    enum: ["Booked", "Cancelled"],
    default: "Booked"
  }

}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
