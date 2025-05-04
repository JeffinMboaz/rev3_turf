import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import TNavbar from "../components/TNavbar";

function BookTurf() {
  const { id } = useParams(); // turf ID
  const [turfEvent, setTurfEvent] = useState(null);
  const [show, setShow] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    courtType: "Full Court",
    hours: 1,
  });

  useEffect(() => {
    const getEvents = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/getevents/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTurfEvent(res.data);
      } catch (error) {
        console.error(error.response?.data?.message || error.message);
        toast.error(
          error.response?.data?.message || "Failed to fetch turf events",
          {
            position: "top-right",
          }
        );
      }
    };
    getEvents();
  }, [id]);

  const handleShow = (event) => {
    setSelectedEvent(event);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedEvent(null);
    setFormData({
      date: "",
      startTime: "",
      endTime: "",
      courtType: "Full Court",
      hours: 1,
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBooking = async () => {
    if (!formData.date || !formData.startTime || !formData.endTime) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/book`,
        {
          turfname: turfEvent.turfname,
          eventSelected: selectedEvent?.name,
          courtType: formData.courtType,
          hours: formData.hours,
          date: formData.date,
          startTime: formData.startTime,
          endTime: formData.endTime,
          price: selectedEvent?.price,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Booking successful!");
      handleClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    }
  };

  if (!turfEvent) {
    return <p className="text-center mt-5">Loading...</p>;
  }

  const { turfname, address, price, heroimg, events, location } = turfEvent;
  const latitude = location?.coordinates[1];
  const longitude = location?.coordinates[0];

  return (
    <>
      <TNavbar />
      <Container className="my-4">
        <Card className="shadow-sm">
          <Card.Header className="bg-primary text-white text-center">
            <h4 className="mb-0">Book Your Turf</h4>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <h5>{turfname}</h5>
                <p>
                  <strong>Address:</strong> {address}
                </p>
                <p>
                  <strong>Price:</strong> ₹{price}
                </p>
                {heroimg && (
                  <img
                    src={heroimg}
                    alt="Turf"
                    className="img-fluid rounded shadow-sm"
                  />
                )}
              </Col>
              <Col md={6}>
                <div style={{ width: "100%", height: "300px" }}>
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
                    allowFullScreen
                    title="Turf Location"
                  ></iframe>
                </div>
              </Col>
            </Row>

            <hr />

            {events && events.length > 0 ? (
              <div>
                <h5 className="mt-4">Available Events</h5>
                <Row>
                  {events.map((event, idx) => (
                    <Col md={6} lg={4} key={idx} className="mb-4">
                      <Card className="h-100 shadow-sm">
                        {event.img && (
                          <Card.Img
                            variant="top"
                            src={event.img}
                            alt={event.name}
                            style={{ height: "180px", objectFit: "cover" }}
                          />
                        )}
                        <Card.Body className="d-flex flex-column">
                          <Card.Title>{event.name}</Card.Title>
                          <Card.Text>Type: {event.type}</Card.Text>
                          <Card.Text>Price: ₹{event.price}/hour</Card.Text>
                          <Button
                            variant="success"
                            className="mt-auto"
                            onClick={() => handleShow(event)}
                          >
                            Book Now
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            ) : (
              <p>No events available for this turf.</p>
            )}
          </Card.Body>
          <Card.Footer className="text-muted text-center">
            <Link to="/userdashboard">
              <Button>Back</Button>
            </Link>
          </Card.Footer>
        </Card>
      </Container>

      {/* Booking Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Book For :{selectedEvent?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
          <Form.Group className="mb-3">
              <Form.Label>TurfName</Form.Label>
              <Form.Control
                type="text"
                name="turfname"
                value={turfname}
                onChange={handleInputChange}
              />
            </Form.Group>
          <Form.Group className="mb-3">
              <Form.Label>Game</Form.Label>
              <Form.Control
                type="text"
                name="game"
                value={selectedEvent?.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
  <Form.Label>Start Time</Form.Label>
  <Form.Select
    name="startTime"
    value={formData.startTime}
    onChange={handleInputChange}
  >
    {Array.from({ length: 24 }).map((_, i) => {
      const hour24 = i.toString().padStart(2, '0') + ":00";

      const hour12 = i % 12 === 0 ? 12 : i % 12;
      const ampm = i < 12 ? 'AM' : 'PM';
      const label = `${hour12}:00 ${ampm}`;

      return (
        <option key={hour24} value={hour24}>
          {label}
        </option>
      );
    })}
  </Form.Select>
</Form.Group>
         
          <Form.Group className="mb-3">
  <Form.Label>End Time</Form.Label>
  <Form.Select
    name="endTime"
    value={formData.endTime}
    onChange={handleInputChange}
  >
    {Array.from({ length: 24 }).map((_, i) => {
      const hour24 = i.toString().padStart(2, '0') + ":00";
      const hour12 = i % 12 === 0 ? 12 : i % 12;
      const ampm = i < 12 ? 'AM' : 'PM';
      const label = `${hour12}:00 ${ampm}`;

      return (
        <option key={hour24} value={hour24}>
          {label}
        </option>
      );
    })}
  </Form.Select>
</Form.Group>


            <Form.Group className="mb-3">
              <Form.Label>Court Type</Form.Label>
              <Form.Select
                name="courtType"
                value={formData.courtType}
                onChange={handleInputChange}
              >
                <option>Full Court</option>
                <option>Half Court</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hours</Form.Label>
              <Form.Control
                type="number"
                name="hours"
                min={1}
                max={12}
                value={formData.hours}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleBooking}>
            Confirm Booking
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default BookTurf;
