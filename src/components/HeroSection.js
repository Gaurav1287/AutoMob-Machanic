import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import hero from "../assets/images/herosec3.jpg";
import hero1 from "../assets/images/herosec2.jpg";
import hero2 from "../assets/images/herosec4.jpg";

const HeroSection = () => {
  return (
    <div className="hero-container" id="home">
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        navigation
        autoplay={{ delay: 4000 }}
        loop={true}
      >
        <SwiperSlide>
          <div className="slide">
            <img src={hero} alt="Car Repair" />
            <div className="overlay">
              <h1>Expert Car Repair Services</h1>
              <p>Fast & reliable car servicing at your doorstep.</p>
              <button className="cta-button">Book Now</button>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="slide">
            <img src={hero1} alt="Bike Repair" />
            <div className="overlay">
              <h1>Bike Repair & Maintenance</h1>
              <p>Premium bike repair services available.</p>
              <button className="cta-button">Get Service</button>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="slide">
            <img src={hero2} alt="Auto Repair" />
            <div className="overlay1 ">
              <h1>Professional Auto Repairs</h1>
              <p>High-quality maintenance for your vehicle.</p>
              <button className="cta-button">Contact Us</button>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default HeroSection;
