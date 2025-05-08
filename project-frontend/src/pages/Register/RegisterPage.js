import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import axios from '../../api';
import { useNavigate } from 'react-router-dom';
const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const navigate = useNavigate();
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setFieldErrors({});
        let errors = {};
        // Basic frontend validation
        if (!email.trim()) {
            errors.email = 'Email is required';
        }
        if (!password.trim()) {
            errors.password = 'Password is required';
        }
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }
        try {
            await axios.post('/register', { email, password });
            navigate('/admin');
        }
        catch (err) {
            const serverMessage = err.response?.data?.error || 'Registration failed';
            setError(serverMessage);
            if (serverMessage.toLowerCase().includes('email')) {
                setFieldErrors((prev) => ({ ...prev, email: serverMessage }));
            }
            else if (serverMessage.toLowerCase().includes('password')) {
                setFieldErrors((prev) => ({ ...prev, password: serverMessage }));
            }
        }
    };
    return (_jsx("div", { className: "d-flex justify-content-center align-items-center vh-100", children: _jsxs("div", { className: "card p-4 shadow", style: { width: '100%', maxWidth: '400px' }, children: [_jsx("h2", { className: "card-title text-center mb-4", children: "Admin Register" }), error && _jsx("div", { className: "alert alert-danger", children: error }), _jsxs("form", { onSubmit: handleRegister, children: [_jsxs("div", { className: "mb-3", children: [_jsx("label", { htmlFor: "email", className: "form-label", children: "Email" }), _jsx("input", { id: "email", type: "text", className: `form-control ${fieldErrors.email ? 'is-invalid' : ''}`, placeholder: "Enter your email", value: email, onChange: (e) => setEmail(e.target.value), required: true }), fieldErrors.email && _jsx("div", { className: "invalid-feedback", children: fieldErrors.email })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { htmlFor: "password", className: "form-label", children: "Password" }), _jsx("input", { id: "password", type: "password", className: `form-control ${fieldErrors.password ? 'is-invalid' : ''}`, placeholder: "Enter your password", value: password, onChange: (e) => setPassword(e.target.value), required: true }), fieldErrors.password && _jsx("div", { className: "invalid-feedback", children: fieldErrors.password })] }), _jsx("button", { type: "submit", className: "btn btn-primary w-100", children: "Register" })] })] }) }));
};
export default RegisterPage;
