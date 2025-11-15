import React, { useEffect, useState } from "react";
import "./AdminRequest.css";

function AdminRequest() {
  const [requests, setRequests] = useState([]);

  // Fetch all adoption requests
  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/requests");
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Approve request and set dog as adopted
  const handleApprove = async (requestId, dogId) => {
    try {
      // 1. Approve the adoption request
      await fetch(`http://localhost:5000/api/requests/${requestId}/approve`, {
        method: "PUT",
      });

      // 2. Update the dog's status to adopted
      await fetch(`http://localhost:5000/api/dogs/${dogId}/adopt`, {
        method: "PUT",
      });

      fetchRequests(); // Refresh requests
    } catch (err) {
      console.error(err);
    }
  };

  // Deny request (delete it)
  const handleReject = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/requests/${id}`, {
        method: "DELETE",
      });
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete request
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      try {
        await fetch(`http://localhost:5000/api/requests/${id}`, {
          method: "DELETE",
        });
        fetchRequests();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="adoption-requests-page">
      {/* HEADER */}
      <header className="header">
        <h1 className="title">Adoption Requests</h1>
        <div className="admin-btn">
          <a href="/admin" className="btn-admin">
            🛠 Admin Panel
          </a>
        </div>
      </header>

      {/* TABLE */}
      <div className="table-container">
        <table className="requests-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Address</th>
              <th>Occupation</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Dog</th>
              <th>Message</th>
              <th>Request Date</th>
              <th>Status / Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: "center" }}>
                  No adoption requests found.
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req.id}>
                  <td>{req.name}</td>
                  <td>{req.age}</td>
                  <td>{req.address}</td>
                  <td>{req.occupation}</td>
                  <td>{req.email}</td>
                  <td>{req.phone}</td>
                  <td>{req.dog_name || "N/A"}</td>
                  <td>{req.message}</td>
                  <td>
                    {new Date(req.request_date).toLocaleString("en-US", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  <td>
                    <div className="action-buttons">
                      {req.status?.toLowerCase().trim() === "pending" ? (
                        <>
                          <button
                            className="approve-btn"
                            onClick={() => handleApprove(req.id, req.dog_id)}
                          >
                            ✅ Approve
                          </button>
                          <button
                            className="reject-btn"
                            onClick={() => handleReject(req.id)}
                          >
                            ❌ Deny
                          </button>
                        </>
                      ) : (
                        <span
                          className={
                            req.status.toLowerCase() === "approved"
                              ? "status-approved"
                              : "status-rejected"
                          }
                        >
                          {req.status.charAt(0).toUpperCase() +
                            req.status.slice(1)}
                        </span>
                      )}
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(req.id)}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminRequest;
