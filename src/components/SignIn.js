// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../index.css";

// const SignInModal = ({ close }) => {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [errorMessage, setErrorMessage] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const signInData = { email: formData.email, password: formData.password };
//     console.log('Signin request payload:', signInData); // Debug: Log the data being sent
//     try {
//       const response = await fetch('http://localhost:3000/api/auth/signin', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(signInData),
//       });
//       const data = await response.json();
//       console.log('Signin response:', data); // Debug: Log the response
//       if (data.status === 'SUCCESS') {
//         localStorage.setItem('token', data.token);
//         localStorage.setItem('userType', data.data.userType);
//         localStorage.setItem('userName', data.data.name);
//         if (data.data.userType === 'user') {
//           navigate('/user-dashboard');
//         } else if (data.data.userType === 'mechanic') {
//           navigate('/shop-dashboard');
//         }
//         close();
//       } else {
//         setErrorMessage(data.message);
//       }
//     } catch (error) {
//       console.error('Signin error:', error); // Debug: Log the full error
//       setErrorMessage('An error occurred. Please try again.');
//     }
//   };

//   return (
//     <div className="modal-overlay" onClick={close}>
//       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//         <h2>Sign In</h2>
//         {errorMessage && <p className="error-message">{errorMessage}</p>}
//         <form onSubmit={handleSubmit}>
//           <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
//           <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
//           <button type="submit" className="modal-button">Login</button>
//         </form>
//         <button className="close-button" onClick={close}>✖</button>
//       </div>
//     </div>
//   );
// };

// export default SignInModal;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const SignInModal = ({ close }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const signInData = { email: formData.email, password: formData.password };
    console.log("Signin request payload:", signInData);
    try {
      const response = await fetch("http://localhost:3000/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signInData),
      });
      const data = await response.json();
      console.log("Signin response:", data);
      if (data.status === "SUCCESS") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userType", data.data.userType);
        localStorage.setItem("userName", data.data.name);
        if (data.data.userType === "user") {
          navigate("/user-dashboard");
        } else if (data.data.userType === "mechanic") {
          navigate("/shop-dashboard");
        }
        close();
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error("Signin error:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-modal">
        <button className="close-button" onClick={close}>✖</button>
        <h2 className="modal-title">Welcome Back</h2>
        {errorMessage && <p className="message error">{errorMessage}</p>}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="modal-button primary">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInModal;