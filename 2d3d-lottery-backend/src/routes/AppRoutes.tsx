import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { routes } from './routes';
import ProtectedRoute from './ProtectedRoute';

// Public pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';

// Protected pages
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Betting from '../pages/Betting';
import Transactions from '../pages/Transactions';
import Wallet from '../pages/Wallet';

// Admin pages
import AdminDashboard from '../pages/admin/Dashboard';
import AdminBets from '../pages/admin/Bets';
import AdminTransactions from '../pages/admin/Transactions';
import AdminUsers from '../pages/admin/Users';
import AdminSettings from '../pages/admin/Settings';

// Error pages
import NotFound from '../pages/NotFound';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path={routes.home.path} element={<Home />} />
      <Route path={routes.login.path} element={<Login />} />
      <Route path={routes.register.path} element={<Register />} />

      {/* Protected routes */}
      <Route
        path={routes.dashboard.path}
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={routes.profile.path}
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path={routes.betting.path}
        element={
          <ProtectedRoute>
            <Betting />
          </ProtectedRoute>
        }
      />
      <Route
        path={routes.transactions.path}
        element={
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        }
      />
      <Route
        path={routes.wallet.path}
        element={
          <ProtectedRoute>
            <Wallet />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path={routes.adminDashboard.path}
        element={
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={routes.adminBets.path}
        element={
          <ProtectedRoute requireAdmin>
            <AdminBets />
          </ProtectedRoute>
        }
      />
      <Route
        path={routes.adminTransactions.path}
        element={
          <ProtectedRoute requireAdmin>
            <AdminTransactions />
          </ProtectedRoute>
        }
      />
      <Route
        path={routes.adminUsers.path}
        element={
          <ProtectedRoute requireAdmin>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path={routes.adminSettings.path}
        element={
          <ProtectedRoute requireAdmin>
            <AdminSettings />
          </ProtectedRoute>
        }
      />

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes; 