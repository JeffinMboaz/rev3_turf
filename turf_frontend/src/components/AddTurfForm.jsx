import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

function AddTurfForm({ show, handleClose, refreshData }) {
  const [formData, setFormData] = useState({
    turfname: "",
    address: "",
    coordinates: [0, 0],
    heroimg: "",
    court: "",
    price: "",
    availability: true,
    events: [],
  });

  const [eventForm, setEventForm] = useState({
    name: "",
    type: "",
    price: "",
    img: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "coordinates") {
      setFormData({
        ...formData,
        coordinates: value.split(",").map((c) => parseFloat(c.trim())),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setEventForm({ ...eventForm, [name]: value });
  };

  const handleAddEvent = () => {
    const { name, type, price, img } = eventForm;
    if (name && type && price && img) {
      setFormData((prev) => ({
        ...prev,
        events: [...prev.events, { ...eventForm, price: parseFloat(price) }],
      }));
      setEventForm({ name: "", type: "", price: "", img: "" });
    } else {
      toast.warn("Please fill all event fields");
    }
  };

  const handleRemoveEvent = (index) => {
    const updated = formData.events.filter((_, i) => i !== index);
    setFormData({ ...formData, events: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5006/api/auth/addturf", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Turf added successfully");
      refreshData();
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add turf");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} scrollable size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add New Turf with Events</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "75vh", overflowY: "auto" }}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Turf Name</Form.Label>
            <Form.Control type="text" name="turfname" onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control type="text" name="address" onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Coordinates (longitude, latitude)</Form.Label>
            <Form.Control type="text" name="coordinates" onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Image URL</Form.Label>
            <Form.Control type="text" name="heroimg" onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Court Type</Form.Label>
            <Form.Control type="text" name="court" onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control type="number" name="price" onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Available"
              checked={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.checked })}
            />
          </Form.Group>

          <hr />
          <h5>Add Events</h5>
          <Form.Group className="mb-2">
            <Form.Label>Event Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={eventForm.name}
              onChange={handleEventChange}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Court Type</Form.Label>
            <Form.Control
              type="text"
              name="type"
              value={eventForm.type}
              onChange={handleEventChange}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Event Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={eventForm.price}
              onChange={handleEventChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Event Image URL</Form.Label>
            <Form.Control
              type="text"
              name="img"
              value={eventForm.img}
              onChange={handleEventChange}
            />
          </Form.Group>
          <Button variant="secondary" onClick={handleAddEvent} className="mb-3">
            Add Event
          </Button>

          <ul>
            {formData.events.map((event, index) => (
              <li key={index}>
                {event.name} ({event.type}) - ₹{event.price}
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="ms-2"
                  onClick={() => handleRemoveEvent(index)}
                >
                  ×
                </Button>
              </li>
            ))}
          </ul>

          <Button variant="primary" type="submit">
            Add Turf
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddTurfForm;
