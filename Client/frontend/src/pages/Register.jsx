import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../service/api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/user/register', { username, email, password });
      login(res.data.token, res.data.user);
      navigate('/rooms');
    } catch (error) {
      setErr(error.response?.data || error.message);
    }
  };

  return (
    <div className="auth-page">
      <h2>Register</h2>
      {err && <p className="error">{err}</p>}
      <form onSubmit={handleSubmit}>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
