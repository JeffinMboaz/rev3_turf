import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { IoSearch } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TbLogout2 } from "react-icons/tb";
import { FaUserCircle } from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";

function TNavbar() {
  const [show, setShow] = useState(false);
  const [showIn, setShowIn] = useState(false);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const { darkMode, toggleTheme } = useTheme();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (token && user) {
      setIsLoggedIn(true);
      setUserRole(user.role);
    }
  }, []);

  const handleCloseSignUp = () => setShow(false);
  const handleShowSignUp = () => setShow(true);
  const handleCloseSignIn = () => setShowIn(false);
  const handleShowSignIn = () => setShowIn(true);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phonenumber: "",
    role: "",
    password: "",
    confirmpassword: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/registeras`,
        formData
      );
      handleCloseSignUp();
      toast.success(res.data.message || "Registered Successfully", {
        position: "top-right",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed", {
        position: "top-right",
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/login`,
        loginData,
        { withCredentials: true }
      );
      toast.success(res.data.message || "Login successful", {
        position: "top-right",
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      handleCloseSignIn();
      setIsLoggedIn(true);
      navigate(res.data.redirectTo);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed", {
        position: "top-right",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
    toast.success("Logged out successfully", { position: "top-right" });
  };

  return (
    <>
      {/* Registration Offcanvas */}
      <Offcanvas show={show} onHide={handleCloseSignUp} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Sign Up</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form onSubmit={handleRegister}>
            <FloatingLabel label="Full name" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Fullname"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange} 
                required
              />
            </FloatingLabel>
            <FloatingLabel label="Email address" className="mb-3">
              <Form.Control
                type="email"
                placeholder="name@example.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FloatingLabel>
            <FloatingLabel label="Phone number" className="mb-3">
              <Form.Control
                type="tel"
                placeholder="Phone number"
                name="phonenumber"
                value={formData.phonenumber}
                onChange={handleChange}
                required
              />
            </FloatingLabel>
            <FloatingLabel label="Role" className="mb-3">
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="user">User</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </FloatingLabel>
            <FloatingLabel label="Password" className="mb-3">
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </FloatingLabel>
            <FloatingLabel label="Confirm Password" className="mb-3">
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                name="confirmpassword"
                value={formData.confirmpassword}
                onChange={handleChange}
                required
              />
            </FloatingLabel>
            <Button variant="success" className="mt-3 w-100" type="submit">
              Register
            </Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Login Offcanvas */}
      <Offcanvas show={showIn} onHide={handleCloseSignIn} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Sign In</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form onSubmit={handleLogin}>
            <FloatingLabel label="Email address" className="mb-3">
              <Form.Control
                type="email"
                placeholder="name@example.com"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                autoComplete="email"
                required
              />
            </FloatingLabel>
            <FloatingLabel label="Password" className="mb-3">
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                autoComplete="current-password"
                required
              />
            </FloatingLabel>
            <Button
              variant="outline-success"
              className="mt-3 w-100"
              type="submit"
            >
              Login
            </Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
        <Container fluid className="px-3">
          <Navbar.Brand
            href={
              isLoggedIn
                ? userRole === "user"
                  ? "/userdashboard"
                  : userRole === "manager"
                  ? "/managerdashboard"
                  : userRole === "admin"
                  ? "/admindashboard"
                  : "/"
                : "/"
            }
            
          >
            EFC Turf
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto gap-2">
              {isLoggedIn ? (
                <>
                  {userRole === "user" && (
                    <>
                      <Form className="d-flex ">
                        <InputGroup className="rounded-pill overflow-hidden">
                          <Form.Control
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                            className="border-0"
                            style={{ borderRadius: "50px 0 0 50px" }}
                          />
                          <Button
                            className="bg-white text-dark border-0"
                            type="submit"
                            style={{ borderRadius: "0 50px 50px 0" }}
                          >
                            <IoSearch   size={20} />
                          </Button>
                        </InputGroup>
                      </Form>

  
                      <Nav.Link href="/mybooking">My Bookings</Nav.Link>
                      <Nav.Link href="/reviewrate">Review & Rate</Nav.Link>
                      <Nav.Link href="/profile"><FaUserCircle size={25} /></Nav.Link>


                    </>
                  )}
                  {userRole === "manager" && (
                    <>
                      <Nav.Link href="/addturf">Add Turf</Nav.Link>
                      <Nav.Link href="/viewbookings">View Bookings</Nav.Link>
                      <Nav.Link href="/updateturf">Update Turf</Nav.Link>
                      <Nav.Link href="/profile"><FaUserCircle size={25} /></Nav.Link>

                    </>
                  )}
                  {userRole === "admin" && (
                    <>
                      <Nav.Link href="/managers">Managers</Nav.Link>
                      <Nav.Link href="/user">Users</Nav.Link>
                      <Nav.Link href="/reviews">Reviews</Nav.Link>
                      <Nav.Link href="/viewbookings">View Bookings</Nav.Link>
                      <Nav.Link href="/updateturf">Update Turf</Nav.Link>
                      <Nav.Link href="/profile"><FaUserCircle size={25} /></Nav.Link>

                    </>
                  )}
                  <Nav.Link onClick={handleLogout}>
                    Logout <TbLogout2 size={20} />
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link href="#about">About</Nav.Link>
                  <Nav.Link onClick={handleShowSignUp}>Sign Up</Nav.Link>
                  <Nav.Link onClick={handleShowSignIn}>Sign In</Nav.Link>
                  <Button variant="outline-light" onClick={toggleTheme}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default TNavbar;
