import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import DashboardNavbar from "./components/DashboardNavbar";
import HeroSection from "./components/HeroSection";
import About from "./components/About";
import Services from "./components/Services"; 
import Testimonials from "./components/Testimonials";
import CallToAction from "./components/CallToAction";
import Footer from "./components/Footer";
import UserDashboard from "./components/UserDashboard";
import ShopDashboard from "./components/ShopDashboard";
import UserProfile from "./components/UserProfile"; 
import ShopProfile from "./components/ShopProfile"; 
import UserHistory from "./components/UserHistory"; 
import ShopHistory from "./components/ShopHistory"; 
import "./index.css";

function Layout() {
  const location = useLocation();
  const isDashboard = location.pathname.includes("dashboard") || 
                     location.pathname.includes("profile") || 
                     location.pathname.includes("history") || 
                     location.pathname === "/user-services";

  return (
    <>
      {isDashboard ? <DashboardNavbar /> : <Navbar />}
      <Routes>
        <Route path="/" element={
          <>
            <HeroSection />
            <About />
            <Services />
            <Testimonials />
            <CallToAction />
          </>
        } />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/shop-dashboard" element={<ShopDashboard />} />
        <Route path="/user-services" element={<Services />} /> {/* Reusing Services for users */}
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/shop-profile" element={<ShopProfile />} />
        <Route path="/user-history" element={<UserHistory />} />
        <Route path="/shop-history" element={<ShopHistory />} />
      </Routes>
      {!isDashboard && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
