import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import AdminLayout from '../components/layout/AdminLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AdminRoute from '../components/auth/AdminRoute';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import Dashboard from '../components/dashboard/Dashboard';
import TwoD from '../components/betting/TwoD';
import ThreeD from '../components/betting/ThreeD';
import Wallet from '../components/wallet/Wallet';
import AdminDashboard from '../components/admin/Dashboard';
import UserManagement from '../components/admin/UserManagement';
import BetManagement from '../components/admin/BetManagement';
import TransactionManagement from '../components/admin/TransactionManagement';
import Settings from '../components/admin/Settings';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/2d"
        element={
          <ProtectedRoute>
            <Layout>
              <TwoD />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/3d"
        element={
          <ProtectedRoute>
            <Layout>
              <ThreeD />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/wallet"
        element={
          <ProtectedRoute>
            <Layout>
              <Wallet />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminLayout>
              <UserManagement />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/bets"
        element={
          <AdminRoute>
            <AdminLayout>
              <BetManagement />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/transactions"
        element={
          <AdminRoute>
            <AdminLayout>
              <TransactionManagement />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <AdminRoute>
            <AdminLayout>
              <Settings />
            </AdminLayout>
          </AdminRoute>
        }
      />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes; 