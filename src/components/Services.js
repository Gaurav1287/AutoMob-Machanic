import React from "react";

const services = [
  { id: 1, name: "Car Engine Repair", description: "Complete engine repair services.", image: "/Images/img1.jpg", type: "Car" },
  { id: 2, name: "Brake Service", description: "Brake repair and maintenance.", image: "/Images/img2.jpg", type: "Car" },
  { id: 3, name: "Oil Change", description: "Regular oil change for your vehicle.", image: "/Images/img3.jpg", type: "Car" },
  { id: 4, name: "Bike Engine Tuning", description: "Professional tuning for bike engines.", image: "/Images/img4.jpg", type: "Bike" },
  { id: 5, name: "Bike Chain Service", description: "Lubrication and maintenance for smooth operation.", image: "/Images/img5.jpg", type: "Bike" },
  { id: 6, name: "Tire Replacement", description: "High-quality tires for better road grip.", image: "/Images/img6.jpg", type: "Bike" },
  { id: 7, name: "Wheel Alignment", description: "Proper wheel alignment for a smooth drive.", image: "/Images/img7.jpg", type: "Car" },
  { id: 8, name: "Battery Replacement", description: "Quick and reliable battery replacement.", image: "/Images/img8.jpg", type: "Bike" },
  { id: 9, name: "AC Repair", description: "Car AC cooling system repair and maintenance.", image: "/Images/img9.jpg", type: "Car" }
];

const Services = () => {
  return (
    <div className="services-container" id="service">
      <h2>Our Services</h2>
      <div className="service-grid">
      {services.map((service) => (
          <div key={service.id} className="service-card1">
            <img src={service.image} alt={service.name} />
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <button className="book-now-btn">Book Now</button>
            <span className={`service-type ${service.type.toLowerCase()}`}>{service.type} Service</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
