import React from 'react';
import { motion } from 'framer-motion';
import { User, LogOut, Shield, ChevronRight, Settings, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="page-container" style={{ gap: '2rem' }}>
      <header style={{ textAlign: 'center', marginTop: '1rem' }}>
        <div style={{ 
          width: '100px', 
          height: '100px', 
          borderRadius: '50%', 
          background: 'var(--primary-light)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 1rem',
          border: '4px solid white',
          boxShadow: 'var(--shadow-md)'
        }}>
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <User size={50} color="var(--primary)" />
          )}
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{user?.firstName} {user?.lastName}</h2>
        <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>{user?.designation || 'Employee'}</p>
      </header>

      <section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-soft)', border: '1px solid var(--border)' }}>
          <Shield size={20} color="var(--primary)" />
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '600' }}>Account Security</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Manage your password</p>
          </div>
          <ChevronRight size={18} color="var(--text-light)" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-soft)', border: '1px solid var(--border)' }}>
          <Bell size={20} color="var(--primary)" />
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '600' }}>Notifications</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Customize alerts</p>
          </div>
          <ChevronRight size={18} color="var(--text-light)" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-soft)', border: '1px solid var(--border)' }}>
          <Settings size={20} color="var(--primary)" />
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '600' }}>App Settings</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Theme and language</p>
          </div>
          <ChevronRight size={18} color="var(--text-light)" />
        </div>
      </section>

      <button 
        onClick={logout}
        style={{ 
          marginTop: 'auto',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '0.75rem', 
          padding: '1rem', 
          borderRadius: 'var(--radius-md)', 
          background: '#fee2e2', 
          color: '#ef4444', 
          fontWeight: '600',
          border: '1px solid #fecaca'
        }}
      >
        <LogOut size={20} />
        Log Out Session
      </button>
    </div>
  );
};

export default Profile;
