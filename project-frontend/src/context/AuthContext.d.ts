import React from 'react';
export declare const AuthContext: React.Context<{
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
}>;
export declare const AuthProvider: React.FC<{
    children: React.ReactNode;
}>;
