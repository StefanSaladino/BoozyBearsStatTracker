import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api';
import { AuthContext } from '../../context/AuthContext';

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
    <div className="container mb-4" style={{ maxWidth: '400px', marginTop: '5rem' }}>
      <h2 className="text-center mb-4">Admin Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMsg && <div className="alert alert-danger py-2">{errorMsg}</div>}
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
