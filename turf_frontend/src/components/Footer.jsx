import React from "react";
import { MdCopyright } from "react-icons/md";
import { IoLogoInstagram } from "react-icons/io5";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
function Footer() {
  return (
    <div className="bg-dark text-white py-4 ">
    <div className="container-fluid">
      
      {/* Social Icons */}
      <div className="d-flex justify-content-center gap-4 mt-4 mb-3 flex-wrap">
        <IoLogoInstagram size={35} />
        <FaFacebook size={35} />
        <FaXTwitter size={35} />
        <FaYoutube size={40} />
      </div>
  
      {/* Contact Info - Responsive Grid */}
      <div className="container text-center mb-4">
        <div className="row gy-2">
          <div className="col-12 col-md-4">
            <p className="mb-0">Contact: efcturfs@support.com</p>
          </div>
          <div className="col-12 col-md-4">
            <p className="mb-0">Phone: +91 6278956235</p>
          </div>
          <div className="col-12 col-md-4">
            <p className="mb-0">Terms and Conditions | Policy</p>
          </div>
        </div>
      </div>
  
      {/* Copyright */}
      <p className="mb-0 text-center">
        <MdCopyright /> EFC Fitness Hub & Academies | All rights reserved.
      </p>
    </div>
  </div>
  
  );
}

export default Footer;
