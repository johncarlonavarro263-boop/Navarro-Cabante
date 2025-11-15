import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Auto-redirect if already logged in
  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("admin"));
    if (admin && parseInt(admin.is_admin) === 1) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMessage("Username and password are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("admin", JSON.stringify(data));

        if (parseInt(data.is_admin) === 1) {
          navigate("/admin");
        } else {
          setErrorMessage("Access denied. Admins only.");
        }
      } else {
        setErrorMessage(data.error || "Invalid username or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage("Server error. Please try again later.");
    }
  };

  return (
    <div className="login-page">
      <header>
        <div className="header-wrapper">
          <h1>
            Dog<span>Care</span>
          </h1>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/Service">Services</Link>
            <Link to="/Contacts">Contact</Link>
          </div>
        </div>
      </header>

      {/* ✅ Center wrapper */}
      <div className="login-wrapper">
        <div className="container">
          <h2>Admin Login 🐶</h2>
          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="username">🐾 Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">🔒 Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn">
              🐶 Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
