import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect the user to the login page with a return path to the intended destination
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
