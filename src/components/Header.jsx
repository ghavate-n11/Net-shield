import React from "react";
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={{
      // Modern background with a subtle gradient
      background: "linear-gradient(90deg, #333 0%, #555 100%)",
      color: "#fff",
      padding: "0.75rem 2rem", // Increased padding for a more spacious feel
      minHeight: "60px",       // Slightly taller for presence
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Subtle shadow for depth
      position: "sticky",      // Makes the header stick to the top
      top: 0,
      zIndex: 1000,            // Ensures it stays on top of other content
    }}>
      {/* Logo and Title container */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}> {/* Increased gap */}
        <img
          src="src/assets/Logo.png" // Replace with your actual image path
          alt="NetShield Logo"
          style={{ width: '45px', height: '45px', borderRadius: '10px' }} // Slightly larger logo
        />
        <h1 style={{
          fontSize: "1.75rem", // Larger, more prominent title
          margin: 0,
          fontWeight: "600",   // Slightly bolder font weight
          letterSpacing: "1px" // Adds a little space between letters
        }}>NET SHIELD</h1>
      </div>

      <nav>
        <ul style={{
          listStyle: "none",
          display: "flex",
          gap: "1.5rem", // Increased gap between navigation items
          margin: 0,
          padding: 0
        }}>
          <li>
            <Link
              to="/alerts"
              style={{
                color: "#fff",
                textDecoration: "none",
                fontSize: "1.1rem", // Slightly larger font for links
                padding: "0.5rem 0.75rem", // Padding around link text
                borderRadius: "5px",
                transition: "background-color 0.3s ease, transform 0.2s ease", // Smooth transition for hover
              }}
              // This is a common way to handle hover effects in React with inline styles.
              // For more complex hover states, consider using CSS modules or styled-components.
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Alerts
            </Link>
          </li>
          <li>
            <Link
              to="/tools" // You might want to change this path based on your routing
              style={{
                color: "#fff",
                textDecoration: "none",
                fontSize: "1.1rem",
                padding: "0.5rem 0.75rem",
                borderRadius: "5px",
                transition: "background-color 0.3s ease, transform 0.2s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Tools
            </Link>
          </li>
          {/* You can add more navigation links here */}
          <li>
            <Link
              to="/dashboard"
              style={{
                color: "#fff",
                textDecoration: "none",
                fontSize: "1.1rem",
                padding: "0.5rem 0.75rem",
                borderRadius: "5px",
                transition: "background-color 0.3s ease, transform 0.2s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Dashboard
            </Link>
          </li> 
        </ul>
      </nav>
    </header>
  );
};

export default Header;