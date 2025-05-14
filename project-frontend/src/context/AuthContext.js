import { jsx as _jsx } from "react/jsx-runtime";
// context/AuthContext.tsx
import { createContext, useEffect, useState } from 'react';
import axios from '../api';
export const AuthContext = createContext({
    isAuthenticated: false,
    setIsAuthenticated: () => { },
    loading: true, // Default to true while session is being checked
});
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // State to track loading
    useEffect(() => {
        const checkSession = async () => {
            try {
                await axios.get('/auth/status');
                setIsAuthenticated(true); // User is authenticated
            }
            catch {
                setIsAuthenticated(false); // User is not authenticated
            }
            finally {
                setLoading(false); // Session check is complete
            }
        };
        checkSession(); // Check if user is authenticated on initial load
    }, []);
    return (_jsx(AuthContext.Provider, { value: { isAuthenticated, setIsAuthenticated, loading }, children: children }));
};
