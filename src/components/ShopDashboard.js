import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const ShopDashboard = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [shopProfile, setShopProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [newService, setNewService] = useState({ name: "", description: "", image: "", type: "", price: "", duration: "" });
  const [editService, setEditService] = useState(null);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage("Please sign in as a mechanic.");
          return;
        }

        const profileResponse = await fetch('http://localhost:3000/api/auth/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const profileData = await profileResponse.json();
        if (profileData.status === 'SUCCESS') {
          setShopProfile(profileData.data);
        }

        const servicesResponse = await fetch('http://localhost:3000/api/auth/services', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const servicesData = await servicesResponse.json();
        if (servicesData.status === 'SUCCESS') {
          setServices(servicesData.data);
        }

        const bookingsResponse = await fetch('http://localhost:3000/api/auth/bookings', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const bookingsData = await bookingsResponse.json();
        if (bookingsData.status === 'SUCCESS') {
          setBookings(bookingsData.data);
        }
      } catch (error) {
        setMessage("An error occurred while fetching data.");
        console.error('Fetch error:', error);
      }
    };
    fetchShopData();
  }, []);

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const price = parseFloat(newService.price);
      const offerPrice = price * 0.5; // 50% off
      const serviceWithOffer = { ...newService, price, offerPrice };

      const response = await fetch('http://localhost:3000/api/auth/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(serviceWithOffer),
      });
      const data = await response.json();
      if (data.status === 'SUCCESS') {
        setServices([...services, data.data]);
        setNewService({ name: "", description: "", image: "", type: "", price: "", duration: "" });
        setMessage("Service added successfully!");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Error adding service.");
      console.error(error);
    }
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const price = parseFloat(editService.price);
      const offerPrice = price * 0.5; // 50% off
      const updatedService = { ...editService, price, offerPrice };

      const response = await fetch(`http://localhost:3000/api/auth/services/${editService._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedService),
      });
      const data = await response.json();
      if (data.status === 'SUCCESS') {
        setServices(services.map(s => s._id === editService._id ? data.data : s));
        setEditService(null);
        setMessage("Service updated successfully!");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Error updating service.");
      console.error(error);
    }
  };

  const handleDeleteService = async (serviceId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/auth/services/${serviceId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.status === 'SUCCESS') {
        setServices(services.filter(s => s._id !== serviceId));
        setMessage("Service deleted successfully!");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Error deleting service.");
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/');
  };

  return (
    <div className="shop-dashboard-container">
      <div className="shop-dashboard">
        {/* Header */}
        {shopProfile && (
          <header className="dashboard-header">
            <h1>{shopProfile.shopName} Dashboard</h1>
            <div className="profile-summary">
              <span>Welcome, {shopProfile.name}</span>
              <span>{shopProfile.location}</span>
            </div>
          </header>
        )}

        {/* Main Content */}
        <main className="dashboard-content">
          {/* Service Management */}
          <section className="service-management">
            <div className="section-header">
              <h2>Service Management</h2>
            </div>

            {/* Add Service */}
            <div className="add-service">
              <h3>Add New Service</h3>
              {message && <div className="message success">{message}</div>}
              <form onSubmit={handleAddService} className="service-form">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Service Name"
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Description"
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={newService.image}
                    onChange={(e) => setNewService({ ...newService, image: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <select
                    value={newService.type}
                    onChange={(e) => setNewService({ ...newService, type: e.target.value })}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Car">Car</option>
                    <option value="Bike">Bike</option>
                  </select>
                </div>
                <div className="form-group">
                  <input
                    type="number"
                    placeholder="Price (INR)"
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                    required
                    min="0"
                  />
                  {newService.price && (
                    <p className="offer-price">Offer Price (50% off): ₹{parseFloat(newService.price) * 0.5}</p>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Duration (e.g., 2 hours)"
                    value={newService.duration}
                    onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">Add Service</button>
              </form>
            </div>

            {/* Services List */}
            <div className="services-list">
              <h3>Your Services</h3>
              {services.length === 0 ? (
                <p className="no-data">No services added yet.</p>
              ) : (
                <div className="service-cards">
                  {services.map((service) => (
                    <div key={service._id} className="service-card1">
                      <img src={service.image} alt={service.name} />
                      <div className="card-content">
                        <h4>{service.name}</h4>
                        <p>{service.description}</p>
                        <span className="service-type">{service.type}</span>
                        <p><strong>Price:</strong> ₹{service.price}</p>
                        <p><strong>Offer Price (50% off):</strong> ₹{service.offerPrice}</p>
                        <p><strong>Duration:</strong> {service.duration || "N/A"}</p>
                        <div className="card-actions">
                          <button onClick={() => setEditService(service)} className="btn btn-edit">Edit</button>
                          <button onClick={() => handleDeleteService(service._id)} className="btn btn-delete">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Edit Service */}
            {editService && (
              <div className="edit-service">
                <h3>Edit Service</h3>
                <form onSubmit={handleUpdateService} className="service-form">
                  <div className="form-group">
                    <input
                      type="text"
                      value={editService.name}
                      onChange={(e) => setEditService({ ...editService, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      value={editService.description}
                      onChange={(e) => setEditService({ ...editService, description: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      value={editService.image}
                      onChange={(e) => setEditService({ ...editService, image: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <select
                      value={editService.type}
                      onChange={(e) => setEditService({ ...editService, type: e.target.value })}
                      required
                    >
                      <option value="Car">Car</option>
                      <option value="Bike">Bike</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <input
                      type="number"
                      value={editService.price}
                      onChange={(e) => setEditService({ ...editService, price: e.target.value })}
                      required
                      min="0"
                    />
                    {editService.price && (
                      <p className="offer-price">Offer Price (50% off): ₹{parseFloat(editService.price) * 0.5}</p>
                    )}
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      value={editService.duration || ""}
                      onChange={(e) => setEditService({ ...editService, duration: e.target.value })}
                      required
                      placeholder="Duration (e.g., 2 hours)"
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">Update</button>
                    <button type="button" onClick={() => setEditService(null)} className="btn btn-secondary">Cancel</button>
                  </div>
                </form>
              </div>
            )}
          </section>

          {/* Bookings */}
          <section className="bookings">
            <div className="section-header">
              <h2>Bookings</h2>
            </div>
            {bookings.length === 0 ? (
              <p className="no-data">No bookings yet.</p>
            ) : (
              <div className="booking-table">
                <div className="table-header">
                  <span>User</span>
                  <span>Service</span>
                  <span>Date</span>
                </div>
                {bookings.map((booking) => (
                  <div key={booking._id} className="table-row">
                    <span>{booking.userId?.name || "Unknown User"}</span>
                    <span>{booking.serviceId?.name || "Unknown Service"}</span>
                    <span>{booking.bookedAt ? new Date(booking.bookedAt).toLocaleDateString() : "N/A"}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>

        {/* Footer */}
        <footer className="dashboard-footer">
          <button onClick={handleLogout} className="btn btn-logout">Logout</button>
        </footer>
      </div>
    </div>
  );
};

export default ShopDashboard;