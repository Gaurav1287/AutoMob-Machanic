import React, { useState, useEffect } from "react";
import logo from "../assets/images/logo.jpg";
import SignInModal from "./SignIn";
import SignUpModal from "./SignUp";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleScroll = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setIsLoggedIn(false);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="logo" />
        <h1 className="brand-name">
          <font color="red" size="5">A</font>
          <font color="green" size="6">U</font>
          <font color="black" size="5">T</font>
          <font color="red" size="7">O</font>
          <font color="yellow" size="6">M</font>
          <font color="grey" size="5">O</font>
          <font color="black" size="4">B</font>
        </h1>
      </div>
      <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </div>

      <ul className={`nav-links ${isOpen ? "open" : ""}`}>
        <li><a href="#home" onClick={(e) => handleScroll(e, "home")}>Home</a></li>
        <li><a href="#about" onClick={(e) => handleScroll(e, "about")}>About</a></li>
        <li><a href="#service" onClick={(e) => handleScroll(e, "service")}>Services</a></li>
        <li><a href="#contact" onClick={(e) => handleScroll(e, "contact")}>Contact</a></li>

        {!isLoggedIn ? (
          <>
            <li><button className="nav-button" onClick={() => setShowSignIn(true)}>Sign In</button></li>
            <li><button className="nav-button" onClick={() => setShowSignUp(true)}>Sign Up</button></li>
          </>
        ) : (
          <li><button className="nav-button" onClick={handleLogout}>Logout</button></li>
        )}
      </ul>

      {showSignIn && <SignInModal close={() => setShowSignIn(false)} />}
      {showSignUp && <SignUpModal close={() => setShowSignUp(false)} />}
    </nav>
  );
};

export default Navbar;