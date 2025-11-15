import React, { useState } from "react";
import "./AddDog.css";

function AddDog() {
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    age: "",
    description: "",
    available_for_adoption: "1",
    image: null,
  });

  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");

  // handle text input and select change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // ✅ simple validation (safe to add)
    if (
      !formData.name ||
      !formData.breed ||
      !formData.age ||
      !formData.description
    ) {
      setMessage("⚠️ Please fill in all required fields before submitting!");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("breed", formData.breed);
    data.append("age", formData.age);
    data.append("description", formData.description);
    data.append("available_for_adoption", formData.available_for_adoption);
    if (formData.image) data.append("image", formData.image);

    try {
      const res = await fetch("http://localhost:5000/api/dogs", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        setMessage("✅ Dog added successfully!");
        setFormData({
          name: "",
          breed: "",
          age: "",
          description: "",
          available_for_adoption: "1",
          image: null,
        });
        setPreview("");
      } else {
        setMessage("❌ Failed to add dog. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Error connecting to server.");
    }
  };

  return (
    <div className="add-dog-page">
      <header>
        <div className="header-wrapper">
          <h1>
            Dog<span>Care</span>
          </h1>

          <div className="nav-links">
            <a href="/admin">🏠 Admin Dashboard</a>
            <a href="/adoption-requests">🐾 View Adoption Requests</a>
          </div>

          <div className="logout-btn">
            <a href="/logout">Log Out</a>
          </div>
        </div>
      </header>

      <main>
        {message && <p className="status-message">{message}</p>}
        <h2>Add a New Dog 🐕</h2>

        <div className="add-dog-container">
          <form onSubmit={handleSubmit} className="add-dog-form">
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter dog's name"
              />
            </div>

            <div className="form-group">
              <label>Breed:</label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                required
                placeholder="Enter dog's breed"
              />
            </div>

            <div className="form-group">
              <label>Age:</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="0"
                placeholder="Enter dog's age"
              />
            </div>

            <div className="form-group">
              <label>Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Write something about this dog"
              ></textarea>
            </div>

            <div className="form-group">
              <label>Available for Adoption:</label>
              <select
                name="available_for_adoption"
                value={formData.available_for_adoption}
                onChange={handleChange}
              >
                <option value="1">✅ Yes</option>
                <option value="0">❌ No</option>
              </select>
            </div>

            <div className="form-group">
              <label>Upload Image:</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="image-preview"
                />
              )}
            </div>

            <button type="submit" className="add-button">
              ➕ Add Dog
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default AddDog;
