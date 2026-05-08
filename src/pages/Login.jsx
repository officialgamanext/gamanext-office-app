import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Lock, Eye, EyeOff } from 'lucide-react';
import logo from '../assets/logo-h.png';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login
    navigate('/home');
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', padding: '0.5rem', marginLeft: '-0.5rem' }}
        >
          <ChevronLeft size={24} color="var(--text)" />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', marginBottom: '2rem' }}
      >
        <img src={logo} alt="Gamanext" style={{ height: '84px', marginBottom: '2rem' }} />

        <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--secondary)', marginBottom: '0.5rem' }}>
          Welcome Back
        </h2>
        <p style={{ color: 'var(--text-light)', fontSize: '1rem' }}>
          Log in to continue to your account
        </p>
      </motion.div>

      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label className="input-label">Username</label>
          <div className="input-wrapper">
            <User className="input-icon" size={20} />
            <input
              type="text"
              className="input-field"
              placeholder="Enter your username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Password</label>
          <div className="input-wrapper">
            <Lock className="input-icon" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              className="input-field input-field-password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'right', marginBottom: '2rem' }}>
          <a href="#" style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '600' }}>
            Forgot Password?
          </a>
        </div>

        <button type="submit" className="btn-primary">
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
