import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"; // Star icons

const testimonials = [
  { id: 1, name: "John Doe", feedback: "Best service ever! My car was fixed in no time.", image: "/Images/user1.jpeg", rating: 5 },
  { id: 2, name: "Jane Smith", feedback: "Professional and affordable. Highly recommend!", image: "/Images/user2.jpeg", rating: 4.5 },
  { id: 3, name: "David Wilson", feedback: "Excellent customer service and quality work.", image: "/Images/user3.jpeg", rating: 4 },
  { id: 4, name: "Emma Johnson", feedback: "Quick and reliable service. Will come again!", image: "/Images/user4.png", rating: 5 },
  { id: 5, name: "Michael Brown", feedback: "Friendly staff and great results. 10/10!", image: "/Images/user5.png", rating: 4.5 },
];

// Function to render stars based on rating
const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FaStar key={i} className="star filled" />);
    } else if (i - 0.5 === rating) {
      stars.push(<FaStarHalfAlt key={i} className="star half-filled" />);
    } else {
      stars.push(<FaRegStar key={i} className="star empty" />);
    }
  }
  return stars;
};

const Testimonials = () => {
  return (
    <div className="testimonials-container">
      <h2>Customer Testimonials</h2>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 2000 }}
        pagination={{ clickable: true }}
        navigation
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {testimonials.map((testimonial) => (
          <SwiperSlide key={testimonial.id}>
            <div className="testimonial-card">
              <img src={testimonial.image} alt={testimonial.name} />
              <p>"{testimonial.feedback}"</p>
              <div className="stars">{renderStars(testimonial.rating)}</div> {/* Star Ratings */}
              <h4>{testimonial.name}</h4>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Testimonials;
