import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedTypes = null }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="loading">Φόρτωση...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (allowedTypes && !allowedTypes.includes(currentUser.type)) {
    const fallbackPath = currentUser.type === 'admin' ? '/admin' : '/home';
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
