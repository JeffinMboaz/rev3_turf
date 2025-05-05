import React, { useEffect, useState } from "react";
import TNavbar from "../components/TNavbar";
import Footer from "../components/Footer";
import Card from "react-bootstrap/Card";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function HomePage() {
  const [turf, SetTurfs] = useState([]);

  useEffect(() => {
    const getTurfs = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/allturfs`);
        SetTurfs(res.data || []);
      } catch (error) {
        console.error(error.response?.data?.message || error.message);
        toast.error(error.response?.data?.message || "Failed to fetch turfs", {
          position: "top-right",
        });
      }
    };
    getTurfs();
  }, []);

  const handleCardClick = () => {
    toast.info("Please login", {
      position: "top-right",
    });
  };

  return (
    <>
      <TNavbar />
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-start">
        <div className="container-fluid p-0">
          <img
            src="https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/9def5a2e5a441fc4cfe3ba9ea57c614b448848af"
            alt="hero"
            className="img-fluid w-100"
            style={{
              maxHeight: "600px",
              objectFit: "cover",
              objectPosition: "center",
              overflow: "hidden",
            }}
          />
        </div>

        <div className="container-fluid py-5 bg-secondary text-white">
          <h3 className="text-center fw-semibold">
            <i>Welcome to EFC Fitness Hub & Academies</i>
          </h3>
        </div>

        <div className="px-4 py-3">
          <h2 className="mb-4">Turfs</h2>

          <div className="d-flex flex-wrap gap-4">
            {turf.length > 0 ? (
              turf.map((turfItem, index) => (
                <Card
                  key={turfItem._id || index}
                  style={{ width: "18rem", cursor: "pointer" }}
                  onClick={handleCardClick}
                >
                  <Card.Img
                    variant="top"
                    src={
                      turfItem.image ||
                      "https://5.imimg.com/data5/ANDROID/Default/2021/9/QW/IX/MV/53469450/product-jpeg-500x500.jpg"
                    }
                    alt="turfimg"
                  />
                  <Card.Body>
                    <Card.Title style={{ textTransform: "capitalize" }}>
                      {turfItem.turfname}
                    </Card.Title>
                    <Card.Text className="mb-2">Multi Sports </Card.Text>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p>No turfs available</p>
            )}
          </div>
        </div>

        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar
          pauseOnHover
          theme="colored"
        />
      </div>
      <Footer />
    </>
  );
}

export default HomePage;
