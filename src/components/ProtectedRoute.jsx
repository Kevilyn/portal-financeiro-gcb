import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // If the user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the children components
  // Note: Public routes like /signup are not wrapped by this component in App.jsx,
  // so they remain accessible to everyone (authenticated or not).
  return children;
};

export default ProtectedRoute;