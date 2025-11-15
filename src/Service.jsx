import React from "react";
import "./Service.css";

function Services() {
  return (
    <div className="service-page">
      <header>
        <h1>
          Dog<span>Care</span>🐶
        </h1>
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/Contacts">Contact</a>
        </div>
      </header>

      <main className="main service-content">
        <h2>Our Services</h2>
        <div className="service-grid">
          <div className="service">
            <h3>Adoption Counseling</h3>
            <p>
              Get expert guidance to help you find the perfect furry companion
              for your home.
            </p>
          </div>
          <div className="service">
            <h3>Available Dogs</h3>
            <p>
              Browse our wide selection of friendly dogs waiting for a loving
              home.
            </p>
          </div>
          <div className="service">
            <h3>Post-Adoption Support</h3>
            <p>
              Receive continued support and advice after adoption to ensure a
              smooth transition.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Services;
