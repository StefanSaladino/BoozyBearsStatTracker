// components/LogoutButton.tsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api";
import { AuthContext } from "../context/AuthContext";

const LogoutButton: React.FC = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/logout");
      setIsAuthenticated(false);
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <button onClick={handleLogout} className="btn btn-outline-warning ms-2">
      🚪 Logout
    </button>
  );
};

export default LogoutButton;
