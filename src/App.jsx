import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Home from './pages/Home';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes (with Bottom Nav) */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/tasks" element={<div className="page-container"><h2>Tasks Page</h2></div>} />
          <Route path="/attendance" element={<div className="page-container"><h2>Attendance History</h2></div>} />
          <Route path="/profile" element={<div className="page-container"><h2>Profile Page</h2></div>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
