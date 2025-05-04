import React, { useEffect, useState } from "react";
import TNavbar from "../components/TNavbar";
import Card from "react-bootstrap/Card";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify"; // ⬅️ Also import Toast
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer";
function UserDashboard() {
  const [turf, SetTurfs] = useState([]);

  useEffect(() => {
    const getTurfs = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/allturf`,
           {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
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

  return (
    <>
      <div>
        <TNavbar />
        <div className="px-4 py-3">
          <h2 className="mb-4">Available Turfs</h2>

          <div className="d-flex flex-wrap gap-4">
            {turf.length > 0 ? (
              turf.map((turf, index) => (
                
                <Card key={turf._id || index} style={{ width: "18rem" }}>
                  <Card.Link href={`/bookturf/${turf._id}`}>
                      
                     <Card.Img
                    variant="top"
                    src={
                      turf.image ||
                      "https://5.imimg.com/data5/ANDROID/Default/2021/9/QW/IX/MV/53469450/product-jpeg-500x500.jpg"
                    }
                    alt="turfimg"
                  />   
                    </Card.Link>
                
                  <Card.Body>
                           <Card.Title style={{ textTransform: 'capitalize' }}>
                      {turf.turfname}
                    </Card.Title>
                  
                    <Card.Text>
                      📍 Location: {turf.location.coordinates.join(", ")}
                    </Card.Text>

                    <Card.Link href={`/bookturf/${turf._id}`}>
                      Book Now
                    </Card.Link>
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
        <Footer/>
      </div>
    </>
  );
}

export default UserDashboard;
