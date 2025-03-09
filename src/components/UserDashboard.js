import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "../index.css";

const stripePromise = loadStripe('pk_test_51QwLB8QIXMGI1NOGR0NQFhzm8ltqmtLp8wm5J4zZjzrimom1uJcuWYNu9guHPsZkQzkE19TLTjH6yquZm7DeU4MM00GWCoLGhZ');

const CheckoutForm = ({ clientSecret, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (error) {
      console.error(error);
    } else if (paymentIntent.status === 'succeeded') {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <CardElement className="card-element" />
      <button type="submit" className="btn btn-primary payment-btn" disabled={!stripe}>Pay with Card</button>
    </form>
  );
};

const UserDashboard = () => {
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [locationFilter, setLocationFilter] = useState("");
  const [message, setMessage] = useState("");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [bookingServiceId, setBookingServiceId] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({ userLocation: "", vehicleModel: "", paymentMethod: "Card" });
  const [reviewDetails, setReviewDetails] = useState({ rating: 0, comment: "" });
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const userName = localStorage.getItem("userName") || "User";

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMessage("Please sign in to view shops.");
          return;
        }

        const response = await fetch(`http://localhost:3000/api/auth/shops${locationFilter ? `?location=${locationFilter}` : ''}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.status === "SUCCESS") {
          setShops(data.data);
          setFilteredShops(data.data);
        } else {
          setMessage(data.message);
        }
      } catch (error) {
        setMessage("An error occurred while fetching shops.");
        console.error(error);
      }
    };
    fetchShops();
  }, [locationFilter]);

  const handleServiceClick = async (serviceId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/auth/shops-by-service/${serviceId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.status === "SUCCESS") {
        setSelectedService(serviceId);
        setFilteredShops(data.data);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Error fetching shops for this service.");
      console.error(error);
    }
  };

  const handleBookClick = (serviceId) => {
    setBookingServiceId(serviceId);
    setShowBookingForm(true);
  };

  const handleBookService = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/auth/book-service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          serviceId: bookingServiceId,
          userLocation: bookingDetails.userLocation,
          vehicleModel: bookingDetails.vehicleModel,
          paymentMethod: bookingDetails.paymentMethod
        })
      });
      const data = await response.json();
      if (data.status === "SUCCESS") {
        const bookedService = filteredShops.flatMap(shop => shop.services).find(s => s._id === bookingServiceId) || {};
        const bookedShop = filteredShops.find(shop => shop.services.some(s => s._id === bookingServiceId)) || {};

        setConfirmedBooking({
          serviceName: bookedService.name || "Unknown Service",
          shopName: bookedShop.shopName || "Unknown Shop",
          shopId: bookedShop.id, // Store shopId for review
          price: bookedService.offerPrice || 0,
          duration: bookedService.duration || "N/A",
          userLocation: bookingDetails.userLocation,
          vehicleModel: bookingDetails.vehicleModel,
          paymentMethod: bookingDetails.paymentMethod,
          bookedAt: new Date().toLocaleString()
        });

        if (bookingDetails.paymentMethod === "Card") {
          setClientSecret(data.clientSecret);
          setShowBookingForm(false);
          setShowPayment(true);
        } else {
          setShowBookingForm(false);
          setShowConfirmation(true);
          setMessage(`Booking confirmed with ${bookingDetails.paymentMethod} payment!`);
        }
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Error booking service: " + error.message);
      console.error("Booking error:", error);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setShowConfirmation(true);
    setMessage("Payment successful! Check your email for confirmation.");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/auth/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          shopId: confirmedBooking.shopId,
          rating: reviewDetails.rating,
          comment: reviewDetails.comment
        })
      });
      const data = await response.json();
      if (data.status === "SUCCESS") {
        setMessage("Review submitted successfully!");
        setShowReviewForm(false);
        setReviewDetails({ rating: 0, comment: "" });
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Error submitting review: " + error.message);
      console.error("Review error:", error);
    }
  };

  const handleLocationChange = (e) => {
    setLocationFilter(e.target.value);
    setSelectedService(null);
  };

  const resetFilter = () => {
    setLocationFilter("");
    setSelectedService(null);
    setFilteredShops(shops);
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
    setConfirmedBooking(null);
    setMessage("");
    setShowReviewForm(false);
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-content modern">
        <h2 className="welcome-text">Welcome, {userName}!</h2>
        {message && <p className={`message ${message.includes("successful") ? "success" : "error"}`}>{message}</p>}

        <div className="location-filter modern-filter">
          <input
            type="text"
            placeholder="Filter by Location"
            value={locationFilter}
            onChange={handleLocationChange}
            className="filter-input"
          />
          <button onClick={resetFilter} className="btn btn-secondary modern-btn">Reset</button>
        </div>

        <h3 className="section-title">{selectedService ? "Shops Offering Selected Service" : "Available Mechanic Shops"}</h3>
        {filteredShops.length === 0 ? (
          <p className="no-data modern-no-data">No shops available for this filter.</p>
        ) : (
          <div className="shop-grid">
            {filteredShops.map((shop) => (
              <div key={shop.id} className="shop-card modern-card">
                <div className="shop-header">
                  <h4 className="shop-name">{shop.shopName}</h4>
                  <span className="shop-rating">{shop.avgRating?.toFixed(1) || "0"} ★</span>
                </div>
                {shop.photos && shop.photos.length > 0 && (
                  <div className="shop-photos modern-photos">
                    <img src={shop.photos[0]} alt={`${shop.shopName}`} className="shop-hero-image" />
                  </div>
                )}
                <div className="shop-details">
                  <p><i className="fas fa-map-marker-alt"></i> {shop.location}</p>
                  {/* <p><i className="fas fa-clock"></i> {shop.operatingHours || "N/A"}</p>
                  <p><i className="fas fa-certificate"></i> {shop.certifications?.join(", ") || "None"}</p> */}
                </div>
                <h5 className="services-title">Services Offered</h5>
                {shop.services.length > 0 ? (
                  <div className="service-cards modern-service-grid">
                    {shop.services.map((service) => (
                      <div key={service._id} className="service-card1 modern-service-card">
                        <img src={service.image} alt={service.name} className="service-image" />
                        <div className="card-content">
                          <h4>{service.name}</h4>
                          <p className="service-desc">{service.description}</p>
                          <span className="service-type">{service.type}</span>
                          <p className="service-price">
                            <strong>Price:</strong> ₹<del>{service.price || "N/A"}</del> 
                            <span className="offer-price"> ₹{service.offerPrice || "N/A"}</span>
                          </p>
                          <p><strong>Duration:</strong> {service.duration || "N/A"}</p>
                          <div className="card-actions">
                            <button onClick={() => handleServiceClick(service._id)} className="btn btn-primary modern-btn">View Shops</button>
                            <button onClick={() => handleBookClick(service._id)} className="btn btn-book modern-btn">Book Now</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-services">No services listed for this shop.</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Booking Form Modal */}
        {showBookingForm && (
          <div className="booking-modal">
            <div className="booking-modal-content">
              <h3>Book Service</h3>
              <form onSubmit={handleBookService} className="modern-form">
                <div className="form-group">
                  <label htmlFor="userLocation">Your Location:</label>
                  <input
                    type="text"
                    id="userLocation"
                    value={bookingDetails.userLocation}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, userLocation: e.target.value })}
                    required
                    className="modern-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="vehicleModel">Car/Bike Model:</label>
                  <input
                    type="text"
                    id="vehicleModel"
                    value={bookingDetails.vehicleModel}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, vehicleModel: e.target.value })}
                    required
                    className="modern-input"
                  />
                </div>
                {filteredShops.flatMap(shop => shop.services).find(s => s._id === bookingServiceId) && (
                  <div className="form-group service-info">
                    <p><strong>Service:</strong> {filteredShops.flatMap(shop => shop.services).find(s => s._id === bookingServiceId).name}</p>
                    <p><strong>Price:</strong> ₹<del>{filteredShops.flatMap(shop => shop.services).find(s => s._id === bookingServiceId).price || "N/A"}</del></p>
                    <p><strong>Offer Price:</strong> ₹{filteredShops.flatMap(shop => shop.services).find(s => s._id === bookingServiceId).offerPrice || "N/A"}</p>
                    <p><strong>Duration:</strong> {filteredShops.flatMap(shop => shop.services).find(s => s._id === bookingServiceId).duration || "N/A"}</p>
                  </div>
                )}
                <div className="form-group payment-options">
                  <label>Payment Method:</label>
                  <div className="payment-methods">
                    <label className="payment-option">
                      <input
                        type="radio"
                        value="Card"
                        checked={bookingDetails.paymentMethod === "Card"}
                        onChange={(e) => setBookingDetails({ ...bookingDetails, paymentMethod: e.target.value })}
                      />
                      <span className="payment-icon"><i className="fas fa-credit-card"></i> Card</span>
                    </label>
                    <label className="payment-option">
                      <input
                        type="radio"
                        value="UPI"
                        checked={bookingDetails.paymentMethod === "UPI"}
                        onChange={(e) => setBookingDetails({ ...bookingDetails, paymentMethod: e.target.value })}
                      />
                      <span className="payment-icon"><i className="fas fa-mobile-alt"></i> UPI</span>
                    </label>
                    <label className="payment-option">
                      <input
                        type="radio"
                        value="Cash"
                        checked={bookingDetails.paymentMethod === "Cash"}
                        onChange={(e) => setBookingDetails({ ...bookingDetails, paymentMethod: e.target.value })}
                      />
                      <span className="payment-icon"><i className="fas fa-money-bill-wave"></i> Cash</span>
                    </label>
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary modern-btn">Confirm Booking</button>
                  <button type="button" onClick={() => setShowBookingForm(false)} className="btn btn-secondary modern-btn">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPayment && (
          <div className="modal-overlay">
            <div className="payment-modal modern-modal">
              <h3 className="payment-title">Complete Your Payment</h3>
              <div className="payment-methods-display">
                <div className="payment-method-selected">
                  <i className="fas fa-credit-card payment-icon-large"></i>
                  <p>You've chosen to pay with <strong>Card</strong></p>
                </div>
                <Elements stripe={stripePromise}>
                  <CheckoutForm clientSecret={clientSecret} onSuccess={handlePaymentSuccess} />
                </Elements>
              </div>
              <button onClick={() => setShowPayment(false)} className="btn btn-secondary modern-btn">Cancel</button>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmation && confirmedBooking && (
          <div className="modal-overlay">
            <div className="confirmation-modal modern-modal">
              <h3>Booking Confirmed!</h3>
              <div className="confirmation-details">
                <p><strong>Service:</strong> {confirmedBooking.serviceName}</p>
                <p><strong>Shop:</strong> {confirmedBooking.shopName}</p>
                <p><strong>Offer Price:</strong> ₹{confirmedBooking.price}</p>
                <p><strong>Duration:</strong> {confirmedBooking.duration}</p>
                <p><strong>Your Location:</strong> {confirmedBooking.userLocation}</p>
                <p><strong>Vehicle Model:</strong> {confirmedBooking.vehicleModel}</p>
                <p><strong>Payment Method:</strong> {confirmedBooking.paymentMethod}</p>
                <p><strong>Booked On:</strong> {confirmedBooking.bookedAt}</p>
                {confirmedBooking.paymentMethod !== "Card" && (
                  <p className="payment-instruction">
                    {confirmedBooking.paymentMethod === "Cash" 
                      ? "Please pay the amount in cash at the shop." 
                      : "Please complete the UPI payment at the shop using your preferred app."}
                  </p>
                )}
              </div>
              <button onClick={() => setShowReviewForm(true)} className="btn btn-primary modern-btn review-btn">Submit Review</button>
              <button onClick={closeConfirmation} className="btn btn-secondary modern-btn">Close</button>
            </div>
          </div>
        )}

        {/* Review Form Modal */}
        {showReviewForm && confirmedBooking && (
          <div className="modal-overlay">
            <div className="review-modal modern-modal">
              <h3>Submit Your Review</h3>
              <form onSubmit={handleReviewSubmit} className="modern-form">
                <div className="form-group">
                  <label>Rating (1-5):</label>
                  <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map(star => (
                      <i
                        key={star}
                        className={`fas fa-star ${reviewDetails.rating >= star ? 'active' : ''}`}
                        onClick={() => setReviewDetails({ ...reviewDetails, rating: star })}
                      ></i>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="comment">Comment:</label>
                  <textarea
                    id="comment"
                    value={reviewDetails.comment}
                    onChange={(e) => setReviewDetails({ ...reviewDetails, comment: e.target.value })}
                    className="modern-input modern-textarea"
                    rows="4"
                    placeholder="Share your experience..."
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary modern-btn" disabled={reviewDetails.rating === 0}>Submit Review</button>
                  <button type="button" onClick={() => setShowReviewForm(false)} className="btn btn-secondary modern-btn">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;