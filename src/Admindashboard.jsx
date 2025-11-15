import React, { useEffect, useState } from "react";
import "./admindashboard.css";

function AdminDashboard() {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch dogs
  const fetchDogs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/dogs");
      const data = await res.json();
      setDogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("admin"));
    if (!admin || parseInt(admin.is_admin) !== 1) {
      window.location.href = "/Login";
      return;
    }

    fetchDogs();

    const params = new URLSearchParams(window.location.search);
    if (params.get("added") === "1") setMessage("✅ Dog added successfully!");
    if (params.get("deleted") === "1") setMessage("❌ Dog deleted successfully!");
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this dog?")) return;

    try {
      await fetch(`http://localhost:5000/api/dogs/${id}`, { method: "DELETE" });
      setDogs(dogs.filter((dog) => dog.id !== id));
      setMessage("Dog deleted successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    window.location.href = "/Login";
  };

  if (loading) return <p>Loading dogs...</p>;

  return (
    <div className="admin-dashboard">
      <header>
        {/* Left - Log out button */}
        <div className="logout-btn">
          <button onClick={handleLogout}>Log Out</button>
        </div>

        {/* Center - Add Dog and Requests links */}
        <div className="nav-links">
          <a href="/add-dog">➕ Add Dog</a>
          <a href="/adoption-requests">🐾 View Adoption Requests</a>
        </div>

        {/* Right - Keep DogCare unchanged */}
        <h1>
          Dog<span>Care</span>
        </h1>
      </header>

      <main>
        <h2>Welcome, Admin! 🐕</h2>
        {message && <p className="success-message">{message}</p>}

        <div className="dog-list">
          {dogs.length === 0 && <p>No dogs found.</p>}
          {dogs.map((dog) => (
            <div key={dog.id} className="dog-card">
              <h3>🐶 {dog.name}</h3>
              <img
                src={
                  dog.image_url
                    ? `http://localhost:5000/uploads/${dog.image_url}`
                    : "/default-dog.jpg"
                }
                alt={dog.name}
              />
              <p>Breed: {dog.breed}</p>
              <p>Age: {dog.age} years</p>
              <p>
                Status:{" "}
                {dog.available_for_adoption
                  ? "✅ Available"
                  : "❌ Not available"}
              </p>

              {/* ✅ Restored dog description */}
              {dog.description && (
                <p className="dog-description">
                  <strong>Description:</strong> {dog.description}
                </p>
              )}

              <div className="dog-actions">
                <a href={`/edit-dog/${dog.id}`}>Edit</a>
                <button onClick={() => handleDelete(dog.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
