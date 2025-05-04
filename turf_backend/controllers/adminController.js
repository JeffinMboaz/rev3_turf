const Turf = require("../models/turf");
const User = require("../models/user_Details")
const Manager = require("../models/manager");

const TurfEvents = require ("../models/turfevents");
const { addTurfWithEvents,addEventsToTurf, getEventsByTurf,
    updateTurfEvent,updateTurf,deleteTurfEvent,
    deleteTurfAndEvents }=require('../controllers/turfController')

const {registerAs} = require('../controllers/userauth')

const getTurfsByAdmin = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    if (userRole !== 'admin') {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    const turfs = await Turf.find();

    res.status(200).json(turfs);
  } catch (err) {
    console.error("❌ Error fetching turfs:", err);
    res.status(500).json({ message: "Server error" });
  }
};
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteManager = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedManager = await Manager.findByIdAndDelete(id);

        if (!deletedManager) {
            return res.status(404).json({ message: "Manager not found" });
        }

        res.status(200).json({ message: "Manager deleted successfully" });

    } catch (error) {
        console.error("Delete manager error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

 


module.exports = { getTurfsByAdmin,deleteUser,deleteManager,
    addTurfWithEvents,
    addEventsToTurf,
    getEventsByTurf,
    updateTurfEvent,
    updateTurf,
    deleteTurfEvent,
    deleteTurfAndEvents,
    registerAs };
