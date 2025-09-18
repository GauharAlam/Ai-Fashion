import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Loader } from './Loader';

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useContext(AuthContext);
  const location = useLocation();

  if (!auth) {
    return null; 
  }

  const { isAuthenticated, isAdmin, loading } = auth;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="text-pink-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    // Optional: show an "Access Denied" page or redirect to home
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;