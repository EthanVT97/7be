import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from '../../store';
import ProtectedRoute from './ProtectedRoute';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <ProtectedRoute>
      {user?.role === 'admin' ? (
        children
      ) : (
        <Navigate to="/dashboard" state={{ from: location }} replace />
      )}
    </ProtectedRoute>
  );
};

export default AdminRoute; 