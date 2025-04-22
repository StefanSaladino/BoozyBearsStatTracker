// pages/LoginPage.tsx
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import { AuthContext } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/login', { email, password });
      setIsAuthenticated(true);
      navigate('/admin-dashboard');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', textAlign: 'center' }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
        <button
          type="submit"
          style={{ padding: '0.5rem 1rem', width: '100%', background: '#007bff', color: '#fff', border: 'none' }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
