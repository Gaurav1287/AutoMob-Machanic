import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.jpg";

const DashboardNavbar = () => {
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType"); // Get userType from localStorage

  // Logout function
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Handle Services navigation
  const handleServicesClick = () => {
    if (userType === "user") {
      navigate("/user-dashboard"); // New route for user to see all services
    } else if (userType === "mechanic") {
      navigate("/shop-dashboard"); // Shop stays on their dashboard (services already there)
    }
  };

  // Handle Profile navigation
  const handleProfileClick = () => {
    if (userType === "user") {
      navigate("/user-profile"); // New route for user profile
    } else if (userType === "mechanic") {
      navigate("/shop-profile"); // New route for shop profile
    }
  };

  // Handle History navigation
  const handleHistoryClick = () => {
    if (userType === "user") {
      navigate("/user-history"); // New route for user booking history
    } else if (userType === "mechanic") {
      navigate("/shop-history"); // New route for shop booking history
    }
  };

  return (
    <nav className="dashboard-navbar">
      <div className="dashboard-logo">
        <img src={logo} alt="logo" />
        <h1 className="brand-name">AutoMob-Mechanic</h1>
      </div>
      <ul className="dashboard-nav-links">
        <li>
          <button className="na-button" onClick={handleServicesClick}>
            Services
          </button>
        </li>
        <li>
          <button className="na-button" onClick={handleProfileClick}>
            Profile
          </button>
        </li>
        <li>
          <button className="na-button" onClick={handleHistoryClick}>
            History
          </button>
        </li>
        <li>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default DashboardNavbar;