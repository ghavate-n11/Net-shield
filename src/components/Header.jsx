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
      <h1 style={{ fontSize: "1.25rem", margin: 0 }}>Net Shield</h1>
      <nav>
        <ul style={{
          listStyle: "none",
          display: "flex",
          gap: "1rem",
          margin: 0,
          padding: 0
        }}>

          <li><Link to="/alerts" style={{ color: "#fff", textDecoration: "none" }}>Alerts</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
