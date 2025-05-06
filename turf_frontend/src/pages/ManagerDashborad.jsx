// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import Card from "react-bootstrap/Card";
// import TNavbar from "../components/TNavbar";
// import Footer from "../components/Footer";
// import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
// import { FaRegEdit } from "react-icons/fa";
// import { MdDeleteOutline } from "react-icons/md";
// import { IoMdAdd } from "react-icons/io";
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function ManagerDashboard() {
//   const [getMTurf, setGetMTurf] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const mngrTurfs = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         console.log("Token:", token); // For debugging

//         const res = await axios.get("http://localhost:5006/api/auth/mngrturfs", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         console.log("Fetched Turfs:", res.data); // For debugging
//         setGetMTurf(res.data || []);
//       } catch (error) {
//         console.error("Fetch Error:", error.response?.data?.message || error.message);
//         toast.error(error.response?.data?.message || "Failed to fetch turfs", {
//           position: "top-right",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     mngrTurfs();
//   }, []);

//   return (
//     <>
//       <TNavbar />
//       <div className="min-vh-100 p-4">
//         <div className="text-center mb-4">
//           <h4 className="fw-bold">Manager Panel</h4>
//         </div>

//         <div className="d-flex flex-wrap justify-content-center gap-3">
//           <OverlayTrigger placement="bottom" overlay={<Tooltip>New Turf</Tooltip>}>
//             <Button className="bg-warning text-dark" style={{ border: "none" }}>
//               <IoMdAdd size={20} className="me-1" />
//               New Turf
//             </Button>
//           </OverlayTrigger>

//           <OverlayTrigger placement="bottom" overlay={<Tooltip>New Event</Tooltip>}>
//             <Button className="bg-dark text-white" style={{ border: "none" }}>
//               <IoMdAdd size={20} className="me-1" />
//               New Event
//             </Button>
//           </OverlayTrigger>

//           <OverlayTrigger placement="bottom" overlay={<Tooltip>Edit Turf</Tooltip>}>
//             <Button className="bg-dark text-white" style={{ border: "none" }}>
//               <FaRegEdit size={20} className="me-1" />
//               Edit Turf
//             </Button>
//           </OverlayTrigger>

//           <OverlayTrigger placement="bottom" overlay={<Tooltip>Edit Event</Tooltip>}>
//             <Button className="bg-dark text-white" style={{ border: "none" }}>
//               <FaRegEdit size={20} className="me-1" />
//               Edit Event
//             </Button>
//           </OverlayTrigger>

//           <OverlayTrigger placement="bottom" overlay={<Tooltip>Delete Turf</Tooltip>}>
//             <Button className="bg-dark text-white" style={{ border: "none" }}>
//               <MdDeleteOutline size={20} className="me-1" />
//               Delete Turf
//             </Button>
//           </OverlayTrigger>

//           <OverlayTrigger placement="bottom" overlay={<Tooltip>Delete Event</Tooltip>}>
//             <Button className="bg-dark text-white" style={{ border: "none" }}>
//               <MdDeleteOutline size={20} className="me-1" />
//               Delete Event
//             </Button>
//           </OverlayTrigger>
//         </div>
//          <div className="px-4 py-3">
//         <h2 className="mb-4">Manage Turfs</h2>

//         <div className="d-flex flex-wrap gap-4 justify-content-center">
//           {loading ? (
//             <p>Loading...</p>
//           ) : getMTurf.length > 0 ? (
//             getMTurf.map((mt, index) => (
//               <Card key={mt._id || index} style={{ width: '18rem' }}>
//                 <Card.Img
//                   variant="top"
//                   src={mt.heroimg}
//                   alt={mt.turfname}
//                 />
//                 <Card.Body>
//                   <Card.Title>{mt.turfname}</Card.Title>
//                   <Card.Text>
//                     <strong>Address:</strong> {mt.address}<br />
//                     <strong>Price:</strong> ₹{mt.price}<br />
//                     <strong>Court:</strong> {mt.court}<br />
//                     <strong>Available:</strong> {mt.availability ? "Yes" : "No"}
//                   </Card.Text>
//                 </Card.Body>
//               </Card>
//             ))
//           ) : (
//             <p>No turfs available</p>
//           )}
//         </div>
//       </div>
//       </div>
     
//       <Footer />
//     </>
//   );
// }

// export default ManagerDashboard;


// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import Card from "react-bootstrap/Card";
// import TNavbar from "../components/TNavbar";
// import Footer from "../components/Footer";
// import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
// import { FaRegEdit } from "react-icons/fa";
// import { MdDeleteOutline } from "react-icons/md";
// import { IoMdAdd } from "react-icons/io";
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import AddTurfForm from "../components/AddTurfForm"; // ✅ IMPORT

// function ManagerDashboard() {
//   const [getMTurf, setGetMTurf] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showAddModal, setShowAddModal] = useState(false); // ✅ Modal control

//   const fetchTurfs = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get("http://localhost:5006/api/auth/mngrturfs", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setGetMTurf(res.data || []);
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to fetch turfs", {
//         position: "top-right",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTurfs();
//   }, []);

//   return (
//     <>
//       <TNavbar />
//       <div className="min-vh-100 p-4">
//         <div className="text-center mb-4">
//           <h4 className="fw-bold">Manager Panel</h4>
//         </div>

//         <div className="d-flex flex-wrap justify-content-center gap-3">
//           {/* ✅ New Turf Button triggers modal */}
//           <OverlayTrigger placement="bottom" overlay={<Tooltip>New Turf</Tooltip>}>
//             <Button
//               className="bg-warning text-dark"
//               style={{ border: "none" }}
//               onClick={() => setShowAddModal(true)}
//             >
//               <IoMdAdd size={20} className="me-1" />
//               New Turf
//             </Button>
//           </OverlayTrigger>

//           <OverlayTrigger placement="bottom" overlay={<Tooltip>New Event</Tooltip>}>
//             <Button className="bg-dark text-white" style={{ border: "none" }}>
//               <IoMdAdd size={20} className="me-1" />
//               New Event
//             </Button>
//           </OverlayTrigger>

//           <OverlayTrigger placement="bottom" overlay={<Tooltip>Edit Turf</Tooltip>}>
//             <Button className="bg-dark text-white" style={{ border: "none" }}>
//               <FaRegEdit size={20} className="me-1" />
//               Edit Turf
//             </Button>
//           </OverlayTrigger>

//           <OverlayTrigger placement="bottom" overlay={<Tooltip>Edit Event</Tooltip>}>
//             <Button className="bg-dark text-white" style={{ border: "none" }}>
//               <FaRegEdit size={20} className="me-1" />
//               Edit Event
//             </Button>
//           </OverlayTrigger>

//           <OverlayTrigger placement="bottom" overlay={<Tooltip>Delete Turf</Tooltip>}>
//             <Button className="bg-dark text-white" style={{ border: "none" }}>
//               <MdDeleteOutline size={20} className="me-1" />
//               Delete Turf
//             </Button>
//           </OverlayTrigger>

//           <OverlayTrigger placement="bottom" overlay={<Tooltip>Delete Event</Tooltip>}>
//             <Button className="bg-dark text-white" style={{ border: "none" }}>
//               <MdDeleteOutline size={20} className="me-1" />
//               Delete Event
//             </Button>
//           </OverlayTrigger>
//         </div>
//       </div>

//       <div className="px-4 py-3">
//         <h2 className="mb-4">Available Turfs</h2>

//         <div className="d-flex flex-wrap gap-4">
//           {loading ? (
//             <p>Loading...</p>
//           ) : getMTurf.length > 0 ? (
//             getMTurf.map((mt) => (
//               <Card key={mt._id} style={{ width: '18rem' }}>
//                 <Card.Img variant="top" src={mt.heroimg} />
//                 <Card.Body>
//                   <Card.Title>{mt.turfname}</Card.Title>
//                   <Card.Text>{mt.address}</Card.Text>
//                   <Card.Text>Price: ₹{mt.price}</Card.Text>
//                   <Card.Text>Court: {mt.court}</Card.Text>
//                 </Card.Body>
//               </Card>
//             ))
//           ) : (
//             <p>No turfs available</p>
//           )}
//         </div>
//       </div>

//       <Footer />

//       {/* ✅ Add Turf Modal */}
//       <AddTurfForm
//         show={showAddModal}
//         handleClose={() => setShowAddModal(false)}
//         onTurfAdded={fetchTurfs}
//       />
//     </>
//   );
// }

// export default ManagerDashboard;

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Card from "react-bootstrap/Card";
import TNavbar from "../components/TNavbar";
import Footer from "../components/Footer";
import { Modal, Button, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddTurfForm from "../components/AddTurfForm";

function ManagerDashboard({ show, handleClose, refreshData }) {
  const [getMTurf, setGetMTurf] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchTurfs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5006/api/auth/mngrturfs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGetMTurf(res.data || []);
    } catch (error) {
      console.error("Fetch Error:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Failed to fetch turfs", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTurfs();
  }, []);
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
    <>
      <TNavbar />
      <div className="min-vh-100 p-4">
        <div className="text-center mb-4">
          <h4 className="fw-bold">Manager Panel</h4>
        </div>

        <div className="d-flex flex-wrap justify-content-center gap-3">
          <OverlayTrigger placement="bottom" overlay={<Tooltip>New Turf</Tooltip>}>
            <Button
              className="bg-warning text-dark"
              style={{ border: "none" }}
              onClick={() => setShowModal(true)}
            >
              <IoMdAdd size={20} className="me-1" />
              New Turf
            </Button>
          </OverlayTrigger>

          <OverlayTrigger placement="bottom" overlay={<Tooltip>New Event</Tooltip>}>
            <Button className="bg-dark text-white" style={{ border: "none" }}>
              <IoMdAdd size={20} className="me-1" />
              New Event
            </Button>
          </OverlayTrigger>

          <OverlayTrigger placement="bottom" overlay={<Tooltip>Edit Turf</Tooltip>}>
            <Button className="bg-dark text-white" style={{ border: "none" }}>
              <FaRegEdit size={20} className="me-1" />
              Edit Turf
            </Button>
          </OverlayTrigger>

          <OverlayTrigger placement="bottom" overlay={<Tooltip>Edit Event</Tooltip>}>
            <Button className="bg-dark text-white" style={{ border: "none" }}>
              <FaRegEdit size={20} className="me-1" />
              Edit Event
            </Button>
          </OverlayTrigger>

          <OverlayTrigger placement="bottom" overlay={<Tooltip>Delete Turf</Tooltip>}>
            <Button className="bg-dark text-white" style={{ border: "none" }}>
              <MdDeleteOutline size={20} className="me-1" />
              Delete Turf
            </Button>
          </OverlayTrigger>

          <OverlayTrigger placement="bottom" overlay={<Tooltip>Delete Event</Tooltip>}>
            <Button className="bg-dark text-white" style={{ border: "none" }}>
              <MdDeleteOutline size={20} className="me-1" />
              Delete Event
            </Button>
          </OverlayTrigger>
        </div>
      </div>

      <div className="px-4 py-3">
        <h2 className="mb-4">Available Turfs</h2>
        <div className="d-flex flex-wrap gap-4">
          {loading ? (
            <p>Loading...</p>
          ) : getMTurf.length > 0 ? (
            getMTurf.map((mt, index) => (
              <Card key={index} style={{ width: '18rem' }}>
                <Card.Img variant="top" src={mt.heroimg} />
                <Card.Body>
                  <Card.Title>{mt.turfname}</Card.Title>
                  <Card.Text>
                    <strong>Address:</strong> {mt.address}<br />
                    <strong>Price:</strong> ₹{mt.price}<br />
                    <strong>Court:</strong> {mt.court}<br />
                    <strong>Availability:</strong> {mt.availability ? "Yes" : "No"}
                  </Card.Text>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No turfs available</p>
          )}
        </div>
      </div>

      <ManagerDashboard
        show={showModal}
        handleClose={() => setShowModal(false)}
        refreshData={fetchTurfs}
      />
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
      <Footer />
    </>
  );
}

export default ManagerDashboard;
