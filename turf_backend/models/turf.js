const mongoose = require('mongoose');

const turfSchema = new mongoose.Schema({
  turfname: { type: String, required: true },

  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },

  address: { type: String, required: true },
  heroimg: { type: String },
  court: { type: String, required: true },
  price: { type: Number, required: true },
  availability: { type: Boolean, required: true },

  createdBy: {
    role: {
      type: String,
      enum: ['admin', 'manager'],
      required: true
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'createdBy.role'
    }
  }
}, { timestamps: true });

turfSchema.index({ location: '2dsphere' });

module.exports = mongoose.model("Turf", turfSchema);
