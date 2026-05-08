import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo-h.png';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/home');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: '1rem' }}>
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
        <img src={logo} alt="Gamanext" style={{ height: '84px', marginBottom: '1.5rem' }} />
        
        <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--secondary)', marginBottom: '0.5rem' }}>
          Welcome Back
        </h2>
        <p style={{ color: 'var(--text-light)', fontSize: '1rem' }}>
          Log in to continue to your account
        </p>
      </motion.div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ 
            background: '#fee2e2', 
            color: '#ef4444', 
            padding: '0.75rem', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            textAlign: 'center',
            fontWeight: '500',
            border: '1px solid #fecaca'
          }}
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label className="input-label">Email Address</label>
          <div className="input-wrapper">
            <Mail className="input-icon" size={20} />
            <input 
              type="email" 
              className="input-field" 
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
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
              onChange={(e) => setFormData({...formData, password: e.target.value})}
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

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Logging in...
            </>
          ) : 'Log In'}
        </button>
      </form>
    </div>
  );
};

export default Login;
