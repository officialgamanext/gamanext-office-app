import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Home from './pages/Home';
import MainLayout from './layouts/MainLayout';

import Profile from './pages/Profile';
import Leaves from './pages/Leaves';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes (with Bottom Nav) */}
          <Route 
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/home" element={<Home />} />
            <Route path="/timesheet" element={<div className="page-container"><h2>Timesheet Page</h2></div>} />
            <Route path="/projects" element={<div className="page-container"><h2>Projects Page</h2></div>} />
            <Route path="/leaves" element={<Leaves />} />
            <Route path="/wfh" element={<div className="page-container"><h2>WFH Page</h2></div>} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
