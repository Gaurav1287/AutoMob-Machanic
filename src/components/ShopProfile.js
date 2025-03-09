import React, { useState, useEffect } from "react";
import "../index.css";

const ShopProfile = () => {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/auth/profile", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.status === "SUCCESS") {
          setProfile(data.data);
        } else {
          setMessage(data.message);
        }
      } catch (error) {
        setMessage("Error fetching profile.");
        console.error(error);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="profile-container">
      <h1>Shop Profile</h1>
      {message && <p className="message">{message}</p>}
      {profile ? (
        <div className="profile-card">
          <h2>{profile.shopName}</h2>
          <p><strong>Owner:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Location:</strong> {profile.location}</p>
          <p><strong>Contact:</strong> {profile.contact}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ShopProfile;