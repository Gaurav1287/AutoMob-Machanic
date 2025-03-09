import React from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const Sidebar = ({ userType }) => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>{userType === "mechanic" ? "Shop Dashboard" : "User Dashboard"}</h3>
      </div>
      <ul className="sidebar-menu">
        <li>
          <button onClick={() => navigate(userType === "mechanic" ? "/shop-dashboard" : "/user-dashboard")}>
            Dashboard
          </button>
        </li>
        <li>
          <button onClick={() => navigate(userType === "mechanic" ? "/shop-graphs" : "/user-graphs")}>
            Graphs
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;