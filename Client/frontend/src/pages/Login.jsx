import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../service/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/user/login', { email, password });
      login(res.data.token, res.data.user);
      navigate('/rooms');
    } catch (error) {
      setErr(error.response?.data || error.message);
    }
  };

  return (
    <div className="auth-page">
      <h2>Login</h2>
      {err && <p className="error">{err}</p>}
      <form onSubmit={handleSubmit}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
