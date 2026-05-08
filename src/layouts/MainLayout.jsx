import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, Calendar, Clock, User } from 'lucide-react';

const Layout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingBottom: '70px' }}>
      <Outlet />
      
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
