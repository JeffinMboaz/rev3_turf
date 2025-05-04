const Turfevents = require("../models/turfevents");

const deleteRelatedTurfEvents = async function (next) {
  try {
    const turfId = this.getQuery()._id; // `this` is the Mongoose query object
    await Turfevents.deleteMany({ turf: turfId });
    next();
  } catch (err) {
    next(err); // pass error to Mongoose
  }
};

module.exports = deleteRelatedTurfEvents;
