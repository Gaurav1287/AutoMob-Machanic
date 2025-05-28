<<<<<<< HEAD
import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
// import backgroundImage from "../assets/images/footerback.jpg"; // Add your background image

const Footer = () => {
  return (
    <footer className="footer" >
      <div className="footer-content">
        <h3 className="footer-heading">AutoMob Mechanic</h3>
        <p className="footer-description">Your trusted partner in quality vehicle service 🚗🏍️</p>
        <p className="footer-location">📍 Location: Pondicherry University, Kalapet, India</p>
        <p className="footer-contact">📧 Email: <a href="mailto:gaurav@automobmechanic.com">gaurav@automobmechanic.com</a></p>
        <p className="footer-contact">📞 Call Us: 7979891287</p>

        <div className="social-icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
        </div>

        <p className="footer-note">© {new Date().getFullYear()} AutoMob Mechanic. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
=======
import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
// import backgroundImage from "../assets/images/footerback.jpg"; // Add your background image

const Footer = () => {
  return (
    <footer className="footer" >
      <div className="footer-content">
        <h3 className="footer-heading">AutoMob Mechanic</h3>
        <p className="footer-description">Your trusted partner in quality vehicle service 🚗🏍️</p>
        <p className="footer-location">📍 Location: Pondicherry University, Kalapet, India</p>
        <p className="footer-contact">📧 Email: <a href="mailto:gaurav@automobmechanic.com">gaurav@automobmechanic.com</a></p>
        <p className="footer-contact">📞 Call Us: 7979891287</p>

        <div className="social-icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
        </div>

        <p className="footer-note">© {new Date().getFullYear()} AutoMob Mechanic. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
>>>>>>> main
