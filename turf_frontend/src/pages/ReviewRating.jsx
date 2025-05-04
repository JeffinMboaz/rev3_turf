
import React, { useEffect, useState } from "react";
import TNavbar from "../components/TNavbar";
import axios from "axios";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip"; 
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Footer from "../components/Footer";
function ReviewRating() {
  const [userreview, setUserReview] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newReview, setNewReview] = useState({ turfname: "", rating: 0, review: "" });
  const [turfs, setTurfs] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get("http://localhost:5006/api/auth/getreviews", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUserReview(res.data || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch reviews");
      }
    };

    const getTurfs = async () => {
      try {
        const res = await axios.get("http://localhost:5006/api/auth/allturf", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTurfs(res.data || []);
      } catch (error) {
        console.error(error.response?.data?.message || error.message);
        toast.error(error.response?.data?.message || "Failed to fetch turfs", {
          position: "top-right",
        });
      }
    };

    fetchReviews();
    getTurfs();
  }, []);

  const renderStars = (rating) => {
    const filledStars = "★".repeat(rating);
    const emptyStars = "☆".repeat(5 - rating);
    return (
      <span style={{ color: "#FFD700", fontSize: "20px" }}>
        {filledStars}
        {emptyStars}
      </span>
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5006/api/auth/delreview/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Review deleted successfully");
      setUserReview((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete review.");
    }
  };

  const handleAddReview = async () => {
    try {
      const token = localStorage.getItem("token");
      const { turfname, rating, review } = newReview;

      if (!turfname || !rating || !review) {
        return toast.warn("All fields are required");
      }

      await axios.post(
        `http://localhost:5006/api/auth/ratereview`,
        { turfname, rating, review },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Review submitted successfully");
      setShowModal(false);
      setNewReview({ turfname: "", rating: 0, review: "" });

      const res = await axios.get("http://localhost:5006/api/auth/getreviews", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserReview(res.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    }
  };

  return (
    <>
      <TNavbar />
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-add">Add Review</Tooltip>}>
          <Button onClick={() => setShowModal(true)} className="mx-5 mt-5 bg-dark text-white border-0">
            <i className="bi bi-chat-dots-fill"></i>
          </Button>
        </OverlayTrigger>
      </div>

      <div className="container my-4">
        <h3>Review & Rating</h3>
        <div>
          {userreview.length > 0 ? (
            userreview.map((r) => (
              <div key={r._id} style={{ borderBottom: "1px solid #ccc", marginBottom: "15px", paddingBottom: "10px" }}>
                <p><strong>Turf Name:</strong> {r.turfname?.turfname || "N/A"}</p>
                <p><strong>Rating:</strong> {renderStars(r.rating)}</p>
                <p><strong>Review:</strong> {r.review}</p>
                <Button variant="danger" onClick={() => handleDelete(r._id)}>Delete</Button>
              </div>
            ))
          ) : (
            <p>No reviews available</p>
          )}
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Submit a Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Select Turf</Form.Label>
              <Form.Select
                value={newReview.turfname}
                onChange={(e) => setNewReview({ ...newReview, turfname: e.target.value })}
              >
                <option value="">-- Select Turf --</option>
                {turfs.map((turf) => (
                  <option key={turf._id} value={turf._id}>
                    {turf.turfname}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Rating (1 to 5)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="5"
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Review</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                maxLength="300"
                value={newReview.review}
                onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
              />
              <small>{newReview.review.length}/300 characters</small>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddReview}>Submit Review</Button>
        </Modal.Footer>
      </Modal>
        <Footer/>
    </>
  );
}

export default ReviewRating;
