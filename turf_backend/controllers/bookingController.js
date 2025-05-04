const Booking = require("../models/turfBookings");
const Turf = require("../models/turf");
const User = require("../models/user_Details");
const Manager = require("../models/manager");
const Admin = require("../models/admin");


const bookTurf = async (req, res) => {
  try {
    const {
      turfname,
      eventSelected,
      courtType,
      hours,
      date,
      startTime,
      endTime,
      price,
    } = req.body;

    const user = await User.findById(req.user.id)
      || await Manager.findById(req.user.id)
      || await Admin.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const turf = await Turf.findOne({ turfname });
    if (!turf) {
      return res.status(404).json({ message: "Turf not found" });
    }

    const createdBy = turf.createdBy;

    // ⛔️ Time overlap check
    const existingBookings = await Booking.find({
      turfname,
      courtType,
      date,
      status: "Booked",
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (courtType === "Full Court" && existingBookings.length > 0) {
      return res.status(400).json({
        message: "The Full Court is already booked for this timeslot",
      });
    }

    if (courtType === "Half Court" && existingBookings.length >= 2) {
      return res.status(400).json({
        message: "The Half Court is already fully booked for this timeslot",
      });
    }
    const capitalizeRole = (role) => role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

    const booking = new Booking({
      turfname,
      eventSelected,
      courtType,
      hours,
      date,
      startTime,
      endTime,
      price,
      username: {
        role: user.role,
        id: user._id
      },
      createdBy: {
        role: capitalizeRole(turf.createdBy.role), // Capitalize creator role
        id: turf.createdBy.id
      },
      status: "Booked",
    });

    await booking.save();
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Cancel booking logic

const mongoose = require("mongoose");

const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Fetch the requesting user (User/Admin/Manager)
    const user =
      await User.findById(req.user.id) ||
      await Manager.findById(req.user.id) ||
      await Admin.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the requester is the original booker
    const isBookingOwner =
      booking.username.id.toString() === user._id.toString() &&
      booking.username.role.toLowerCase() === user.role.toLowerCase();

    // Check if the requester is the turf owner (admin or manager)
    const isTurfOwner =
      booking.createdBy.id.toString() === user._id.toString() &&
      booking.createdBy.role.toLowerCase() === user.role.toLowerCase();

    if (!isBookingOwner && !isTurfOwner) {
      return res.status(403).json({ message: "Unauthorized to cancel this booking" });
    }

    booking.status = "Cancelled";
    await booking.save();

    res.status(200).json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//view bookings
 // Get bookings for logged-in user
 const getUserBookings = async (req, res) => {
  try {
    const { id: userId, role: userRole } = req.user;

    const bookings = await Booking.find({ 
      "username.id": userId, 
      "username.role": userRole
    })
    .populate("createdBy.id", "fullname phonenumber")
    .sort({ date: -1 });

    const formattedBookings = bookings.map(b => ({
      _id: b._id,//to cancel
      turfname: b.turfname,
      event: b.eventSelected,
      date: b.date,
      time: `${b.startTime} - ${b.endTime}`,
      status: b.status,
      manager: b.createdBy?.id?.fullname || "N/A",
      managerPhone: b.createdBy?.id?.phonenumber || "N/A"
    }));

    res.status(200).json(formattedBookings);
  } catch (error) {
    console.error("Error getting bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};


module.exports= {bookTurf,cancelBooking, getUserBookings};
