import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Card from "react-bootstrap/Card";

function GetMTurfs() {
    const[getMTurf,setGetMTurf]=useState([]);
    useEffect(() => {
        const mngrTurfs = async () => {
          try {
            const res = await axios.get(`http://localhost:5173/api/auth/allturf`,
               {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            setGetMTurf(res.data || []);
          } catch (error) {
            console.error(error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || "Failed to fetch turfs", {
              position: "top-right",
            });
          }
        };
        mngrTurfs();
      }, []);
  return (
    <div>
       <div className="px-4 py-3">
                <h2 className="mb-4">Available Turfs</h2>
      
                <div className="d-flex flex-wrap gap-4">
                  {getMTurf.length > 0 ? (
                    getMTurf.map((turf, index) => (
                      
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
      
                        </Card.Body>
                      </Card>
                    ))
                  ) : (
                    <p>No turfs available</p>
                  )}
                </div>
              </div>

    </div>
  )
}

export default GetMTurfs
