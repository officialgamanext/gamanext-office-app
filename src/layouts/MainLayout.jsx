import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, Calendar, Clock, User, Bell } from 'lucide-react';
import logo from '../assets/logo-h.png';

const Layout = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingBottom: '70px', paddingTop: '65px' }}>
      {/* Top Header */}
      <header className="top-header glass">
        <button className="header-icon-btn" onClick={() => navigate('/home')}>
          <Home size={22} />
        </button>
        
        <div className="header-logo">
          <img src={logo} alt="Gamanext" />
        </div>
        
        <button className="header-icon-btn">
          <Bell size={22} />
        </button>
      </header>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      
      <nav className="bottom-bar glass">
        <NavLink to="/home" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Home className="nav-icon" />
          <span>Home</span>
        </NavLink>
        <NavLink to="/tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Calendar className="nav-icon" />
          <span>Tasks</span>
        </NavLink>
        <NavLink to="/attendance" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Clock className="nav-icon" />
          <span>History</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <User className="nav-icon" />
          <span>Profile</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Layout;
