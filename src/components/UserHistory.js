import React, { useState, useEffect } from "react";
import "../index.css";

const UserHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/auth/user-bookings", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.status === "SUCCESS") {
          setBookings(data.data);
        } else {
          setMessage(data.message);
        }
      } catch (error) {
        setMessage("Error fetching bookings.");
        console.error(error);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="history-container">
      <h1>Booking History</h1>
      {message && <p className="message">{message}</p>}
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="booking-table">
          <div className="table-header">
            <span>Service</span>
            <span>Shop</span>
            <span>Date</span>
          </div>
          {bookings.map((booking) => (
            <div key={booking._id} className="table-row">
              <span>{booking.serviceId.name}</span>
              <span>{booking.shopId.shopName}</span>
              <span>{new Date(booking.bookedAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserHistory;