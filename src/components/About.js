import React from "react";
import aboutImage from "../assets/images/aboutus.webp";


const About = () => {
  return (
    <div className="about-container" id="about">
      <div className="about-image" data-aos="fade-right">
        <img src={aboutImage} alt="About AutoMob-Mechanic" />
      </div>
      <div className="about-text" data-aos="fade-left">
        <h2>About AutoMob-Mechanic</h2>
        <p>
          <strong>AutoMob-Mechanic</strong> is your one-stop solution for all car and bike repair needs.
          We specialize in providing high-quality vehicle maintenance with expert mechanics and advanced tools.
        </p>
        <ul className="about-list">
          <li>✔ Fast and reliable service</li>
          <li>✔ Affordable and transparent pricing</li>
          <li>✔ Certified expert mechanics</li>
          <li>✔ Genuine spare parts</li>
          <li>✔ Customer satisfaction guaranteed</li>
        </ul>
        <p>
          Whether you need a routine check-up, emergency repairs, or custom tuning,
          AutoMob-Mechanic is here to ensure a smooth ride for you.
        </p>
      </div>
    </div>
  );
};

export default About;
