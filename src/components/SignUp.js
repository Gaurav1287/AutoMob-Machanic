// import React, { useState } from "react";
// import "../index.css";

// const SignUpModal = ({ close }) => {
//   const [userType, setUserType] = useState("user");
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     shopName: "",
//     location: "",
//     contact: "",
//   });
//   const [message, setMessage] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const payload = { ...formData, userType };
//     console.log('Signup request payload:', payload); // Debug: Log the data being sent
//     try {
//       const response = await fetch('http://localhost:3000/api/auth/signup', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });
//       const data = await response.json();
//       console.log('Signup response:', data); // Debug: Log the response

//       if (data.status === 'SUCCESS') {
//         setMessage('Sign Up Successful! Please Sign In.');
//         setTimeout(() => close(), 1500);
//       } else {
//         setMessage(data.message || 'Signup failed. Please try again.');
//       }
//     } catch (error) {
//       console.error('Signup error:', error.message, error.stack); // Enhanced debug: Log full error details
//       setMessage(`An error occurred: ${error.message}. Please try again.`);
//     }
//   };

//   return (
//     <div className="modal-overlay" onClick={close}>
//       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//         <h2>Sign Up</h2>
//         {message && <p className={message.includes('Successful') ? 'message success' : 'message error'}>{message}</p>}
//         <div className="signup-tabs">
//           <button
//             className={userType === "user" ? "active" : ""}
//             onClick={() => setUserType("user")}
//           >
//             User
//           </button>
//           <button
//             className={userType === "mechanic" ? "active" : ""}
//             onClick={() => setUserType("mechanic")}
//           >
//             Mechanic Shop
//           </button>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
//           <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
//           <input type="password" name="password" placeholder="Password" onChange={handleChange} required />

//           {userType === "mechanic" && (
//             <>
//               <input type="text" name="shopName" placeholder="Shop Name" onChange={handleChange} required />
//               <input type="text" name="location" placeholder="Shop Location" onChange={handleChange} required />
//               <input type="tel" name="contact" placeholder="Contact Number" onChange={handleChange} required />
//             </>
//           )}

//           <button type="submit" className="modal-button">Register</button>
//         </form>

//         <button className="close-button" onClick={close}>✖</button>
//       </div>
//     </div>
//   );
// };

// export default SignUpModal;


import React, { useState } from "react";
import "../index.css";

const SignUpModal = ({ close }) => {
  const [userType, setUserType] = useState("user");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    shopName: "",
    location: "",
    contact: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, userType };
    console.log("Signup request payload:", payload);
    try {
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log("Signup response:", data);

      if (data.status === "SUCCESS") {
        setMessage("Sign Up Successful! Please Sign In.");
        setTimeout(() => close(), 1500);
      } else {
        setMessage(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error.message, error.stack);
      setMessage(`An error occurred: ${error.message}. Please try again.`);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-modal">
        <button className="close-button" onClick={close}>✖</button>
        <h2 className="modal-title">Create an Account</h2>
        {message && (
          <p className={`message ${message.includes("Successful") ? "success" : "error"}`}>
            {message}
          </p>
        )}
        <div className="signup-tabs">
          <button
            className={`tab-button ${userType === "user" ? "active" : ""}`}
            onClick={() => setUserType("user")}
          >
            User
          </button>
          <button
            className={`tab-button ${userType === "mechanic" ? "active" : ""}`}
            onClick={() => setUserType("mechanic")}
          >
            Mechanic Shop
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
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

          {userType === "mechanic" && (
            <>
              <div className="form-group">
                <input
                  type="text"
                  name="shopName"
                  placeholder="Shop Name"
                  value={formData.shopName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="location"
                  placeholder="Shop Location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  name="contact"
                  placeholder="Contact Number"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <button type="submit" className="modal-button primary">
            Register Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpModal;