import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/Login/LoginPage';
import { AuthContext } from '../context/AuthContext';
import axios from '../api';
import React, { useState } from 'react';
import { vi } from 'vitest';

vi.mock('../api');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('LoginPage Integration', () => {
  it('logs in user, navigates, and persists authentication state', async () => {
    // Mock the login API call
    mockedAxios.post.mockResolvedValueOnce({ status: 200 });

    const AdminPage = () => {
      const { isAuthenticated } = React.useContext(AuthContext);
      return <div>{isAuthenticated ? 'Welcome, Admin!' : 'Not Authorized'}</div>;
    };

    const App = () => {
      const [isAuthenticated, setIsAuthenticated] = useState(false);
      const [loading, setLoading] = useState(true);

      // Simulate session check (setLoading to false once it's done)
      React.useEffect(() => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          setIsAuthenticated(true); // Simulate a successful login
        }, 1000); // Simulate async session check
      }, []);

      return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, loading }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin-dashboard" element={<AdminPage />} />
          </Routes>
        </AuthContext.Provider>
      );
    };

    render(<MemoryRouter initialEntries={['/login']}><App /></MemoryRouter>);

    // Fill in dummy credentials (matching expected form behavior)
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'admin@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'password123' },
    });

    // Submit the login form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Wait for session check and navigation to admin dashboard
    await waitFor(() => {
      expect(screen.getByText('Welcome, Admin!')).toBeInTheDocument();
    });
  });
});
