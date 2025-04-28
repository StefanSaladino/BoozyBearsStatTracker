import React from "react";

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        padding: "1rem",
        backgroundColor: "#222",
        color: "#fff",
        textAlign: "center",
      }}>
      <p>&copy; 2025 Boozy Bears Hockey</p>

      {/* "Shop the Look" Link */}
      <p>
        <a
          href="https://jerseyden.ca/?srsltid=AfmBOop8xXg8J6moMJeRqE_ZgkBhpyR6tCo6wROacktPvmfdhFwlBd-g"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#ffcc00",
            textDecoration: "none",
            fontWeight: "bold",
          }}>
          Shop the Look
        </a>
      </p>

      {/* Jersey Den Credit */}
      <p style={{ fontSize: "0.9rem", opacity: "0.8" }}>
        All Boozy Bears jerseys were proudly manufactured and provided by 
        <a
          href="https://jerseyden.ca/?srsltid=AfmBOop8xXg8J6moMJeRqE_ZgkBhpyR6tCo6wROacktPvmfdhFwlBd-g"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#ffcc00",
            textDecoration: "none",
            fontWeight: "bold",
          }}>
          	&nbsp;Jersey Den
        </a>
        . All logos and likeness are the property of Jersey Den.
      </p>
    </footer>
  );
};

export default Footer;
