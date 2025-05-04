import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider} from "./contexts/ThemeContext"

import HomePage from "./pages/HomePage";
import UserDashboard from "./pages/UserDashboard";
import ManagerDashboard from "./pages/ManagerDashborad"; // spelling corrected
import AdminDashboard from "./pages/AdminDashboard";
import BookTurf from "./pages/BookTurf";
import MyBookings from "./pages/MyBookings";
import ReviewRating from "./pages/ReviewRating";
import ProfilePage from "./pages/ProfilePage";
function App() {
  return (
    
 <div>
  <ThemeProvider>
  
    <BrowserRouter>
     
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/userdashboard" element={<UserDashboard />} />
          <Route path="/managerdashboard" element={<ManagerDashboard />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/bookturf/:id" element={<BookTurf />} />
          <Route path="/mybooking" element={<MyBookings />} />
          <Route path="/reviewrate" element={<ReviewRating />} />
          <Route path="/profile" element={<ProfilePage />} />


        </Routes>
       
    </BrowserRouter>
    <ToastContainer position="top-right" autoClose={3000} />
    </ThemeProvider>
     </div>
  );
}

export default App;
