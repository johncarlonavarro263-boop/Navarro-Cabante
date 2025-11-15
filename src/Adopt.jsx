import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Adopt.css";

function Adopt() {
  const [dogs, setDogs] = useState([]);
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState(null);

  // Fetch dogs and requests
  const fetchData = async () => {
    try {
      const dogsRes = await fetch("http://localhost:5000/api/dogs");
      const dogsData = await dogsRes.json();
      setDogs(dogsData);

      const requestsRes = await fetch("http://localhost:5000/api/requests");
      const requestsData = await requestsRes.json();
      setRequests(requestsData);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();

    const admin = JSON.parse(localStorage.getItem("admin"));
    if (admin && parseInt(admin.is_admin) === 1) {
      setUsername(admin.username);
    }
  }, []);

  // Handle admin approval from dog card
  const handleApprove = async (requestId, dogId) => {
    try {
      // Approve adoption request
      await fetch(`http://localhost:5000/api/requests/${requestId}/approve`, {
        method: "PUT",
      });

      // Set dog as adopted
      await fetch(`http://localhost:5000/api/dogs/${dogId}/adopt`, {
        method: "PUT",
      });

      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle admin denial from dog card
  const handleDeny = async (requestId) => {
    try {
      await fetch(`http://localhost:5000/api/requests/${requestId}`, {
        method: "DELETE",
      });

      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    setUsername(null);
    window.location.href = "/Login";
  };

  return (
    <div className="adopt-page">
      <header>
        <div className="header-wrapper">
          <h1>
            Dog<span>Care</span>
          </h1>

          <nav className="nav-links">
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/adopt">Adopt</a>
            <a href="/contact">Contact</a>
          </nav>

          <div className="admin-login">
            <a href="/login">Admin-Login</a>
          </div>
        </div>
      </header>

      <main>
        <h1>🐶 Welcome to the Dog Adoption Center! 🐾</h1>
        {message && (
          <div
            className={`notification ${
              message.includes("❌") ? "error" : ""
            }`}
          >
            {message}
          </div>
        )}
        <p>Find your perfect furry friend today!</p>

        <section className="dog-list">
          {dogs.length > 0 ? (
            dogs.map((dog) => {
              // Filter all requests for this dog
              const dogRequests = requests.filter(
                (req) => req.dog_id === dog.id
              );

              // Check if dog has any approved request
              const isAdopted = dogRequests.some(
                (req) => req.status?.toLowerCase() === "approved"
              );

              // Filter pending requests
              const pendingRequests = dogRequests.filter(
                (req) => req.status?.toLowerCase() === "pending"
              );

              return (
                <div className="dog-card" key={dog.id}>
                  <h3>🐕 {dog.name}</h3>
                  <img
                    src={
                      dog.image_url
                        ? `http://localhost:5000/uploads/${dog.image_url}`
                        : "/placeholder.jpg"
                    }
                    alt={dog.name}
                  />
                  <div className="dog-info">
                    <p>
                      <strong>Breed:</strong> {dog.breed}
                    </p>
                    <p>
                      <strong>Age:</strong> {dog.age} years
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      {isAdopted ? "❌ Adopted" : "✅ Available"}
                    </p>
                    {dog.description && (
                      <p>
                        <strong>Description:</strong> {dog.description}
                      </p>
                    )}
                    {pendingRequests.length > 0 && (
                      <div>
                        <p>
                          <strong>Pending Requests:</strong>{" "}
                          {pendingRequests.length}{" "}
                          {pendingRequests.length === 1 ? "person" : "people"}
                        </p>

                        {username && (
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              justifyContent: "center",
                            }}
                          >
                            {pendingRequests.map((req) => (
                              <React.Fragment key={req.id}>
                                <button
                                  className="approve-btn"
                                  onClick={() =>
                                    handleApprove(req.id, dog.id)
                                  }
                                >
                                  ✅ Approve
                                </button>
                                <button
                                  className="reject-btn"
                                  onClick={() => handleDeny(req.id)}
                                >
                                  ❌ Deny
                                </button>
                              </React.Fragment>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {!isAdopted && dog.available_for_adoption && (
                    <Link
                      to={`/adopt_form/${dog.id}`}
                      className="adopt-button"
                    >
                      🐾 Adopt
                    </Link>
                  )}
                </div>
              );
            })
          ) : (
            <p>No dogs available for adoption at the moment. 🐕</p>
          )}
        </section>
      </main>

      <footer>
        <p>© 2025 Dog Adoption Center. All rights reserved. 🐾</p>
      </footer>
    </div>
  );
}

export default Adopt;
