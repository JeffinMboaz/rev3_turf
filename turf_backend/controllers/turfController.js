const mongoose = require("mongoose");
const Turf = require("../models/turf");
const TurfEvents = require ("../models/turfevents");

//create turf and add events


const isValidCoordinates = (coords) =>
  Array.isArray(coords) &&
  coords.length === 2 &&
  coords.every(coord => typeof coord === "number" && !isNaN(coord));

const addTurfWithEvents = async (req, res) => {
  try {
    const user = req.user;
    console.log("User from JWT:", user);

    const {
      turfname,
      address,
      coordinates,
      heroimg,
      court,
      price,
      availability,
      events
    } = req.body;

    if (!turfname || !address || !isValidCoordinates(coordinates) || !court || typeof price !== 'number' || availability === undefined) {
      return res.status(400).json({ message: "Missing or invalid required fields" });
    }

    const newTurf = await Turf.create({
      turfname,
      address,
      location: {
        type: "Point",
        coordinates,
      },
      heroimg,
      court,
      price,
      availability,
      createdBy: {
        role: user.role,
        id: user.id,
      },
    });

    const newTurfevent = await TurfEvents.create({
      turf: newTurf._id,
      turfname: newTurf.turfname, 
      events,
    });

    return res.status(201).json({
      message: "Turf and events added successfully",
      turf: newTurf,
      events: newTurfevent,
    });

  } catch (err) {
    console.error("Error adding turf:", err);
    res.status(500).json({ error: err.message });
  }
};

// add more events to existing turf 
const addEventsToTurf = async (req, res) => {
  try {
    const { turfId } = req.params;
    const { name, type, price, img } = req.body;

    // Check if turf exists
    const turf = await Turf.findById(turfId);
    if (!turf) {
      return res.status(404).json({ message: "Turf not found" });
    }

    // Check if event record already exists for the turf
    let turfEvent = await TurfEvents.findOne({ turf: turfId });

    const newEvent = { name, type, price, img };

    if (turfEvent) {
      // Add new event to existing document
      turfEvent.events.push(newEvent);
      await turfEvent.save();
    } else {
      // Create a new Turfevent document
      turfEvent = new TurfEvents({
        turf: turfId,
        events: [newEvent]
      });
      await turfEvent.save();
    }

    return res.status(201).json({
      message: "Event added successfully",
      turfEvent
    });

  } catch (error) {
    console.error("Error adding event:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
//get all event of one turf


const getEventsByTurf = async (req, res) => {
  try {
    const { turfId } = req.params;

    const turfEvent = await TurfEvents.findOne({ turf: turfId }).populate('turf');

    if (!turfEvent) {
      return res.status(404).json({ message: "No events found for this turf" });
    }

    return res.status(200).json({
      message: "Events fetched successfully",
      turfname: turfEvent.turf?.turfname, // 👈 Extract from populated turf
      location:turfEvent.turf?.location,
      address: turfEvent.turf?.address,
      price: turfEvent.turf?.price,
      heroimg: turfEvent.turf?.heroimg,
      events: turfEvent.events,
    });

  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

//update event of turf
const updateTurfEvent = async (req, res) => {
  try {
    const { turfId, eventId } = req.params;
    const { name, type, price, img } = req.body;

    if (!mongoose.Types.ObjectId.isValid(turfId) || !mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid Turf or Event ID" });
    }

    const turfEventDoc = await TurfEvents.findOne({ turf: turfId });

    if (!turfEventDoc) {
      return res.status(404).json({ message: "Turfevent not found" });
    }

    const eventToUpdate = turfEventDoc.events.id(eventId);
    if (!eventToUpdate) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (name) eventToUpdate.name = name;
    if (type) eventToUpdate.type = type;
    if (price) eventToUpdate.price = price;
    if (img) eventToUpdate.img = img;

    await turfEventDoc.save();

    return res.status(200).json({ message: "Turf event updated successfully", event: eventToUpdate });
  } catch (error) {
    console.error("Error updating turf event:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateTurf = async (req, res) => {
  try {
    const { turfId } = req.params;
    const updates = req.body;

    // Validate turfId
    if (!mongoose.Types.ObjectId.isValid(turfId)) {
      return res.status(400).json({ message: "Invalid Turf ID" });
    }

    // Update the turf
    const updatedTurf = await Turf.findByIdAndUpdate(turfId, updates, { new: true });

    if (!updatedTurf) {
      return res.status(404).json({ message: "Turf not found" });
    }

    res.status(200).json({
      message: "Turf updated successfully",
      turf: updatedTurf
    });
  } catch (error) {
    console.error("Error updating turf:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
//delete one event of turf
const deleteTurfEvent = async (req, res) => {
  try {
    const { turfId, eventId } = req.params;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(turfId) || !mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid turf or event ID" });
    }

    // Find the turfevent document
    const turfEventDoc = await TurfEvents.findOne({ turf: turfId });

    if (!turfEventDoc) {
      return res.status(404).json({ message: "Turf event record not found" });
    }

    // Find and remove the event
    const eventToDelete = turfEventDoc.events.id(eventId);
    if (!eventToDelete) {
      return res.status(404).json({ message: "Event not found in this turf" });
    }

     // Remove the event by filtering
     turfEventDoc.events = turfEventDoc.events.filter(event => event._id.toString() !== eventId);
     await turfEventDoc.save();
 
    return res.status(200).json({
      message: "Event deleted successfully",
      remainingEvents: turfEventDoc.events
    });
  } catch (error) {
    console.error("Error deleting turf event:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
//delete turf and all its events
const deleteTurfAndEvents = async (req, res) => {
  const turfId = req.params.turfId;

  try {
    // Check if the Turf exists
    const turf = await Turf.findById(turfId);
    if (!turf) {
      return res.status(404).json({ message: "Turf not found" });
    }

    // Delete all events linked to the turf
    await TurfEvents.deleteMany({ turf: turfId });

    // Delete the turf itself
    await Turf.findByIdAndDelete(turfId);

    res.status(200).json({ message: "Turf and its events deleted successfully" });
  } catch (error) {
    console.error("Error deleting turf and events:", error);
    res.status(500).json({ message: "Server error while deleting turf and events" });
  }
};

const getAllTurfs = async (req, res) => {
  try {
    const turfs = await Turf.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json(turfs);
  } catch (err) {
    console.error("Error fetching turfs:", err);
    res.status(500).json({ message: "Server error while fetching turfs" });
  }
};
const getMngrTurfs = async (req, res) => {
  try {
    const managerId = req.user.id;
const turfs = await Turf.find({ "createdBy.role": "manager", "createdBy.id": managerId }).sort({ createdAt: -1 });

    res.status(200).json(turfs);
  } catch (err) {
    console.error("Error fetching turfs:", err);
    res.status(500).json({ message: "Server error while fetching turfs" });
  }
};
module.exports = { addTurfWithEvents,addEventsToTurf, getEventsByTurf,updateTurfEvent,updateTurf,
  deleteTurfEvent,deleteTurfAndEvents, getAllTurfs,getMngrTurfs  };
