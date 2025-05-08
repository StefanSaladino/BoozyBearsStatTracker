import { jsx as _jsx } from "react/jsx-runtime";
// context/AuthContext.tsx
import { createContext, useEffect, useState } from 'react';
import axios from '../api';
export const AuthContext = createContext({
    isAuthenticated: false,
    setIsAuthenticated: () => { },
});
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
        const checkSession = async () => {
            try {
                // Use a dedicated /auth/status route instead of /admin
                await axios.get('/auth/status');
                setIsAuthenticated(true); // User is authenticated
            }
            catch {
                setIsAuthenticated(false); // User is not authenticated
            }
        };
        checkSession(); // Check if user is authenticated on initial load
    }, []);
    return (_jsx(AuthContext.Provider, { value: { isAuthenticated, setIsAuthenticated }, children: children }));
};
