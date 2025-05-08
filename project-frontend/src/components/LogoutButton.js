import { jsx as _jsx } from "react/jsx-runtime";
// components/LogoutButton.tsx
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api";
import { AuthContext } from "../context/AuthContext";
const LogoutButton = () => {
    const { setIsAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await axios.post("/logout");
            setIsAuthenticated(false);
            navigate("/");
        }
        catch (err) {
            console.error("Logout failed", err);
        }
    };
    return (_jsx("button", { onClick: handleLogout, className: "btn btn-outline-warning ms-2", children: "\uD83D\uDEAA Logout" }));
};
export default LogoutButton;
