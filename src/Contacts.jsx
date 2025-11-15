import React from "react"
import "./Contacts.css"

const Contacts = () => {
  return (
    <div className="main">
      <header>
        <h1>
          Dog<span>Care</span>🐶
        </h1>
        <nav className="nav-links">
         <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/Service">Services</a>
         
        </nav>
      </header>

      {/* Hero Section */}
      <div className="box a" />
      <div className="box b" />

      {/* Contact Us Section */}
      <section className="info-section" id="contact">
        <h2>Contact Us 📬</h2>
        <p>Have questions or want to get involved? We’d love to hear from you!</p>
        <ul className="contact-list">
          <li>
            <strong>Email:</strong>{" "}
            <a href="mailto:angelitotagpuno@gmail.com">geraldcabante@gmail.com</a>
            {" / "}
            <a href="mailto:johncarlo@gmail.com">johncarlo@gmail.com</a>
          </li>
          <li>
            <strong>Phone:</strong>{" "}
            <a href="tel:+09385254043">+0 961-525-4043</a>
          </li>
          <li>
            <strong>Location:</strong>{" "}
            <a
              href="https://www.google.com/maps/search/?api=1&query=Ylagan+Street+San+Carlos+City+Negros+Occidental"
              target="_blank"
              rel="noopener noreferrer"
            >
              San Carlos City, Negros Occidental
            </a>
          </li>
        </ul>
      </section>

      
    </div>
  );
};

export default Contacts;