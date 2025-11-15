import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./Index.css";
import About from "./About";
import Contacts from "./Contacts";
import Service from "./Service";
import Adopt from "./Adopt";
import Login from "./Login";
import AdoptForm from "./AdoptForm";
import AdminDashboard from "./Admindashboard";
import EditDog from "./EditDog";
import AddDog from "./AddDog";
import AdminRequest from "./AdminRequest";
import dog1 from "./assets/1745570651_R.jpg";
import dog2 from "./assets/1745570704_OIP.jpg";
import 'bootstrap-icons/font/bootstrap-icons.css';


function Home() {
  const [dogs, setDogs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/dogs")
      .then((res) => res.json())
      .then((data) => setDogs(data))
      .catch((err) => console.error("Error fetching dogs:", err));
  }, []);

  return (
    <div className="main">
      <header>
        <h1>
         Dog<span>Care</span>🐶
        </h1>
        <div className="nav-links">
          <Link to="/about">About</Link>
          <Link to="/service">Services</Link> {/* lowercase for consistency */}
          <Link to="/contacts">Contact</Link>  {/* lowercase for consistency */}
        </div>
      </header>

      <div className="center-content">
        <div className="text-content">
          <h3>
            Where your pets <br />
            <span>feel at home</span> <br />
            because they are!
          </h3>
          <p>
            When you adopt a rescue dog, you not only save that dog’s life,
            but you also save a piece of your own.
          </p>
          <Link to="/adopt" className="btn1">
            Adopt now
          </Link>
        </div>

        <div className="image-content">
          <img src={dog1} alt="Happy dog" className="dog1" />
          <img src={dog2} alt="Running dog" className="dog2" />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/service" element={<Service />} />
        <Route path="/adopt" element={<Adopt />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/adopt_form/:dog_id" element={<AdoptForm />} />
        <Route path="/edit-dog/:id" element={<EditDog />} />
        <Route path="/add-dog" element={<AddDog />} /> 
        <Route path="/adoption-requests" element={<AdminRequest />} /> 
      </Routes>
    </Router>
  );
}

export default App;
