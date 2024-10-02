import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext'; // Use useAuth hook instead of directly accessing AuthContext

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); // Access the user via the useAuth hook

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
