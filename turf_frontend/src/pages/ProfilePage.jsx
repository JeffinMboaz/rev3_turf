import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TNavbar from '../components/TNavbar';
import Footer from '../components/Footer';

import 'react-toastify/dist/ReactToastify.css';

function ProfilePage() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phonenumber: '',
    password: ''
  });
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/getprofile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setFormData({
        fullname: response.data.fullname || '',
        email: response.data.email || '',
        phonenumber: response.data.phonenumber || '',
        password: ''
      });

      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch profile');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5006/api/auth/updateprofile', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Profile updated successfully');
      fetchProfile();
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <>
      <TNavbar />
      <div className="container min-vh-100 py-5">
        <h2>User Profile</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="fullname"
                className="form-control"
                value={formData.fullname}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                name="phonenumber"
                className="form-control"
                value={formData.phonenumber}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">New Password (optional)</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-primary">Update Profile</button>
          </form>
        )}
      </div>
     
      <Footer />
    </>
  );
}

export default ProfilePage;
