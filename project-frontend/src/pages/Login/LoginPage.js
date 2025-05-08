import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api';
import { AuthContext } from '../../context/AuthContext';
const LoginPage = () => {
    const { setIsAuthenticated } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/login', { email, password });
            setIsAuthenticated(true);
            navigate('/admin-dashboard');
        }
        catch (err) {
            setErrorMsg(err.response?.data?.message || 'Login failed');
        }
    };
    return (_jsxs("div", { className: "container mb-4", style: { maxWidth: '400px', marginTop: '5rem' }, children: [_jsx("h2", { className: "text-center mb-4", children: "Admin Login" }), _jsxs("form", { onSubmit: handleLogin, children: [_jsx("div", { className: "mb-3", children: _jsx("input", { type: "text", className: "form-control", placeholder: "Email", value: email, onChange: e => setEmail(e.target.value), required: true }) }), _jsx("div", { className: "mb-3", children: _jsx("input", { type: "password", className: "form-control", placeholder: "Password", value: password, onChange: e => setPassword(e.target.value), required: true }) }), errorMsg && _jsx("div", { className: "alert alert-danger py-2", children: errorMsg }), _jsx("button", { type: "submit", className: "btn btn-primary w-100", children: "Login" })] })] }));
};
export default LoginPage;
