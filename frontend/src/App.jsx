import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/layout/PrivateRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyAccount from './pages/VerifyAccount';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import VehicleEntry from './pages/VehicleEntry';
import VehicleExit from './pages/VehicleExit';
import ActiveVehicles from './pages/ActiveVehicles';
import SpacesManagement from './pages/SpacesManagement';
import RateManagement from './pages/RateManagement';
import Reports from './pages/Reports';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-account/:token" element={<VerifyAccount />} />

          {/* Private Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/vehicles/entry"
            element={
              <PrivateRoute>
                <VehicleEntry />
              </PrivateRoute>
            }
          />
          <Route
            path="/vehicles/exit"
            element={
              <PrivateRoute>
                <VehicleExit />
              </PrivateRoute>
            }
          />
          <Route
            path="/vehicles/active"
            element={
              <PrivateRoute>
                <ActiveVehicles />
              </PrivateRoute>
            }
          />
          <Route
            path="/spaces"
            element={
              <PrivateRoute>
                <SpacesManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/rates"
            element={
              <PrivateRoute adminOnly>
                <RateManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <Reports />
              </PrivateRoute>
            }
          />
          
          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
