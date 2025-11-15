import React from "react";
import "./About.css";

function About() {
  return (
    <div className="about-page">
      <header>
        <h1>
          Dog<span>Care</span>🐶
        </h1>
        <nav className="nav-links">
          <a href="/">Home</a>
          <a href="/Service">Services</a>
          <a href="/Contacts">Contact</a>
        </nav>
      </header>

      <section className="info-section" id="about">
        <div className="about-content">
          <h2>About Us 🐾</h2>
          <p>
            At <strong>DogCare</strong>, we believe every dog deserves a loving
            home. We’re a community-driven pet adoption and care center dedicated
            to helping rescue pets find forever families. Since our founding,
            we’ve successfully helped hundreds of dogs find warmth, safety, and
            happiness.
          </p>
          <p>
            Our passionate team includes veterinarians, volunteers, and pet lovers
            who work together to ensure the well-being of each furry friend in our
            care.
          </p>
        </div>
      </section>
    </div>
  );
}

export default About;
