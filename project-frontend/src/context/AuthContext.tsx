// context/AuthContext.tsx
import React, { createContext, useEffect, useState } from 'react';
import axios from '../api';

export const AuthContext = createContext<{
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean; // Add loading state
}>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  loading: true, // Default to true while session is being checked
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // State to track loading

  useEffect(() => {
    const checkSession = async () => {
      try {
        await axios.get('/auth/status');
        setIsAuthenticated(true); // User is authenticated
      } catch {
        setIsAuthenticated(false); // User is not authenticated
      } finally {
        setLoading(false); // Session check is complete
      }
    };

    checkSession(); // Check if user is authenticated on initial load
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
