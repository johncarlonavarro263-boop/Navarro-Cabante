import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditDog.css";

function EditDog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dog, setDog] = useState({
    name: "",
    breed: "",
    age: "",
    description: "",
    available_for_adoption: 0,
    image_url: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch dog info
  useEffect(() => {
    fetch(`http://localhost:5000/api/dogs`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((d) => d.id === parseInt(id));
        if (found) setDog(found);
        else alert("Dog not found");
      })
      .catch((err) => console.error("Error fetching dog:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDog({
      ...dog,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", dog.name);
      formData.append("breed", dog.breed);
      formData.append("age", dog.age);
      formData.append("description", dog.description);
      formData.append("available_for_adoption", dog.available_for_adoption);
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch(`http://localhost:5000/api/dogs/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Update failed");

      setMessage("✅ Dog updated successfully!");
      setTimeout(() => navigate("/admin"), 1500);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update dog");
    }
  };

  if (loading) return <p>Loading dog info...</p>;

  return (
    <main className="edit-dog-container">
      <h2>Edit Dog</h2>

      {message && <div className="notification">{message}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={dog.name}
          onChange={handleChange}
          required
        />

        <label>Breed:</label>
        <input
          type="text"
          name="breed"
          value={dog.breed}
          onChange={handleChange}
          required
        />

        <label>Age:</label>
        <input
          type="number"
          name="age"
          value={dog.age}
          onChange={handleChange}
          required
        />

        <label>Description:</label>
        <textarea
          name="description"
          value={dog.description}
          onChange={handleChange}
          required
        ></textarea>

        <label>Available for Adoption:</label>
        <input
          type="checkbox"
          name="available_for_adoption"
          checked={dog.available_for_adoption === 1}
          onChange={handleChange}
        />

        <label>Upload New Image:</label>
        <input type="file" name="image" onChange={handleImageChange} />

        {dog.image_url && (
          <div className="image-preview">
            <p>Current Image:</p>
            <img
              src={`http://localhost:5000/uploads/${dog.image_url}`}
              alt="Current Dog"
            />
          </div>
        )}

        <button type="submit">Save Changes</button>
      </form>

      <button className="back-btn" onClick={() => navigate("/admin")}>
        ⬅ Back to Admin Panel
      </button>
    </main>
  );
}

export default EditDog;
