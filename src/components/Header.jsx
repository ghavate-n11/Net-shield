import React from "react";
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={{
      background: "#222",
      color: "#fff",
      padding: "0.5rem 1rem",     // Reduced padding
      minHeight: "50px",          // Compact default height
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
      {/* Logo and Title container */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img
          src="src/assets/Logo.png" // Replace with your actual image path
          alt="NetShield Logo"
          style={{ width: '40px', height: '40px', borderRadius: '8px' }}
        />
        <h1 style={{ fontSize: "1.25rem", margin: 0 }}>NET SHIELD</h1>
      </div>

      <nav>
        <ul style={{
          listStyle: "none",
          display: "flex",
          gap: "1rem",
          margin: 0,
          padding: 0
        }}>
          <li>
            <Link to="/alerts" style={{ color: "#fff", textDecoration: "none" }}>
              Alerts
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
