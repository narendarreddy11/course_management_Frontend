import React from "react";
import { FaFacebookF, FaLinkedinIn, FaGithub, FaTwitter, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-dark text-light pt-5 pb-4 mt-5">
      <div className="container text-md-left">
        <div className="row text-md-left">

          {/* --- Column 1: Logo / About --- */}
          <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-warning">CourseApp</h5>
            <p>
              CourseApp is a modern learning management platform built with Spring Boot & React.
              Our goal is to make education simple, accessible, and efficient for students and admins.
            </p>
          </div>

          {/* --- Column 2: Quick Links --- */}
          <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Quick Links</h5>
            <p><a href="/" className="text-light text-decoration-none">Home</a></p>
            <p><a href="/courses" className="text-light text-decoration-none">Courses</a></p>
            <p><a href="/about" className="text-light text-decoration-none">About Us</a></p>
            <p><a href="/contact" className="text-light text-decoration-none">Contact</a></p>
          </div>

          {/* --- Column 3: Useful Resources --- */}
          <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Resources</h5>
            <p><a href="/faq" className="text-light text-decoration-none">FAQ</a></p>
            <p><a href="/support" className="text-light text-decoration-none">Support</a></p>
            <p><a href="/terms" className="text-light text-decoration-none">Terms of Service</a></p>
            <p><a href="/privacy" className="text-light text-decoration-none">Privacy Policy</a></p>
          </div>

          {/* --- Column 4: Contact + Newsletter --- */}
          <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Contact</h5>
            <p>📍 Hyderabad, India</p>
            <p>📧 support@courseapp.com</p>
            <p>📞 +91 98765 43210</p>

            {/* Newsletter */}
            <div className="mt-3">
              <form className="d-flex">
                <input
                  type="email"
                  placeholder="Subscribe..."
                  className="form-control me-2"
                />
                <button className="btn btn-warning" type="submit">Go</button>
              </form>
            </div>

            {/* Social Media Icons */}
            <div className="mt-4">
              <a href="#" className="text-light me-3 fs-5"><FaFacebookF /></a>
              <a href="#" className="text-light me-3 fs-5"><FaTwitter /></a>
              <a href="#" className="text-light me-3 fs-5"><FaInstagram /></a>
              <a href="#" className="text-light me-3 fs-5"><FaLinkedinIn /></a>
              <a href="#" className="text-light fs-5"><FaGithub /></a>
            </div>
          </div>
        </div>

        <hr className="my-4 border-secondary" />

        {/* --- Copyright Row --- */}
        <div className="row align-items-center">
          <div className="col-md-7 col-lg-8">
            <p className="text-center text-md-start mb-0">
              © {new Date().getFullYear()} <span className="text-warning">CourseApp</span>. All Rights Reserved.
            </p>
          </div>

          <div className="col-md-5 col-lg-4">
            <p className="text-center text-md-end mb-0">
              Designed with ❤️ by <span className="text-warning">Your Team</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
