// context/AuthContext.tsx
import React, { createContext, useEffect, useState } from 'react';
import axios from '../api';

export const AuthContext = createContext<{
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Use a dedicated /auth/status route instead of /admin
        await axios.get('/auth/status');
        setIsAuthenticated(true); // User is authenticated
      } catch {
        setIsAuthenticated(false); // User is not authenticated
      }
    };

    checkSession(); // Check if user is authenticated on initial load
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
