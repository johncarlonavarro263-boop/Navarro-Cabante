import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./AdoptForm.css";

function AdoptForm() {
  const { dog_id } = useParams(); // get the dog ID from the URL
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    address: "",
    occupation: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add dog_id to the submission
    const dataToSend = { ...formData, dog_id };

    console.log("Submitting adoption request:", dataToSend); // debug log

    try {
      const res = await fetch("http://localhost:5000/api/adopt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) throw new Error("Network response was not ok");

      const data = await res.json();

      if (data.success) {
        setMessage("✅ Your adoption request has been successfully submitted!");
        setFormData({
          name: "",
          age: "",
          address: "",
          occupation: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        setMessage("❌ Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting adoption request:", err);
      setMessage("❌ Server error. Please check your connection.");
    }
  };

  return (
    <div>
      <button className="back-button" onClick={() => navigate("/")}>
        🏠 Back to Homepage
      </button>

      <div className="adopt-container">
        <div>
          <h1>🐾 Adoption Form</h1>
          <p>Fill in your details to adopt your new furry friend!</p>

          {message && <div className="notification">{message}</div>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="age"
              placeholder="Your Age"
              value={formData.age}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Your Address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="occupation"
              placeholder="Your Occupation"
              value={formData.occupation}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Your Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Any message for us?"
              rows="4"
              value={formData.message}
              onChange={handleChange}
            ></textarea>

            <button type="submit">Submit Adoption Request 🐕</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdoptForm;
