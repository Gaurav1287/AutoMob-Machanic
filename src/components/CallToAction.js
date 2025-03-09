import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import contactImage from "../assets/images/contact.jpg"; // Ensure correct path

const CallToAction = () => {
  const form = useRef();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_2a8f9f8", "template_56abx85", form.current, "tOkwqqBzI0gKHkIO3")
      .then(
        (result) => {
          // console.log("Email Sent Successfully!", result.text);
          setConfirmationMessage("Your inquiry has been sent! We will contact you soon.");
          setFormData({ name: "", email: "", message: "" });
        },
        (error) => {
          // console.error("EmailJS Error:", error.text);
          setConfirmationMessage("Failed to send inquiry. Please try again.");
        }
      );
  };

  return (
    <div className="cta-container" id="contact" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "20px" }}>
      <div className="cta-content" style={{ display: "flex", alignItems: "center", gap: "20px", width: "100%" }}>
        
        {/* Left Side - Image */}
        <motion.div
          className="cta-image"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ flex: 1, textAlign: "center" }}
        >
          <img src={contactImage} alt="Contact Us" style={{ width: "100%", maxWidth: "400px", borderRadius: "10px" }} />
        </motion.div>

        {/* Right Side - Form */}
        <motion.div
          className="cta-form-container"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ flex: 1 }}
        >
          <h2>Need Help? Contact Us!</h2>
          <p>Fill out the form below and we’ll get back to you as soon as possible.</p>

          <form ref={form} className="cta-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />
            <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />
            <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} required style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", minHeight: "100px" }} />
            <button type="submit" className="cta-button" style={{ padding: "10px", borderRadius: "5px", border: "none", backgroundColor: "#28a745", color: "white", cursor: "pointer" }}>
              Send Inquiry
            </button>
          </form>

          {confirmationMessage && (
            <p className="confirmation-message" style={{ color: "green", marginTop: "10px" }}>
              {confirmationMessage}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CallToAction;
