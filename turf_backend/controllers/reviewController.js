const Review = require("../models/reviews");

const ReviewRating = async (req, res) => {
  try {
    const { turfname, rating, review } = req.body;
    // Make sure all required fields are provided
    if (!turfname || !rating || !review) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Create and save the new review
    const newReview = new Review({
      username: req.user.id,   // From authenticateToken middleware
      turfname,
      rating,
      review
    });
    await newReview.save();
    res.status(201).json({
      message: "Review submitted successfully",
      review: newReview
    });
  } catch (error) {
    console.error("❌ Error creating review:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// delete review 
const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

   
    // Allow deletion by original author or admin
    if (review.username.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized to delete this review" });
    }
    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({ message: "Review deleted successfully" });

  } catch (error) {
    console.error("❌ Error deleting review:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all reviews or reviews by turf ID
const getReviews = async (req, res) => {
  try {
    const { turfid } = req.query; // Optional query param to filter by turf

    let filter = {};
    if (turfid) {
      filter.turfname = turfid;
    }

    const reviews = await Review.find(filter)
      .populate("username", "name email") // Populate user info
      .populate("turfname", "turfname location") // Populate turf info
      .sort({ createdAt: -1 }); // Latest reviews first

    res.status(200).json(reviews);
  } catch (error) {
    console.error("❌ Error fetching reviews:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = {
  ReviewRating, deleteReview,getReviews
};
