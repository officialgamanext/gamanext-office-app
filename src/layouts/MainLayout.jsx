import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, ClipboardList, Briefcase, Palmtree, Monitor, User, Bell, Calendar } from 'lucide-react';
import logo from '../assets/logo-h.png';

const Layout = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingBottom: '80px', paddingTop: '75px' }}>
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
        <NavLink to="/timesheet" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <ClipboardList className="nav-icon" />
          <span>Timesheet</span>
        </NavLink>
        <NavLink to="/projects" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Briefcase className="nav-icon" />
          <span>Projects</span>
        </NavLink>
        <NavLink to="/leaves" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Calendar className="nav-icon" />
          <span>Leaves</span>
        </NavLink>
        <NavLink to="/wfh" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Monitor className="nav-icon" />
          <span>WFH</span>
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
