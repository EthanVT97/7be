import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import store from './store';
import theme from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';

// Layout Components
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/admin/AdminLayout';
import AdminRoute from './components/admin/AdminRoute';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// User Components
import Dashboard from './components/dashboard/Dashboard';
import BettingInterface from './components/betting/BettingInterface';
import TransactionManagement from './components/transactions/TransactionManagement';

// Admin Components
import AdminDashboard from './components/admin/Dashboard';
import UserManagement from './components/admin/UserManagement';
import BetManagement from './components/admin/BetManagement';
import AdminTransactionManagement from './components/admin/TransactionManagement';
import Settings from './components/admin/Settings';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="bets" element={<BetManagement />} />
              <Route path="transactions" element={<AdminTransactionManagement />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* User Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="betting" element={<BettingInterface />} />
              <Route path="transactions" element={<TransactionManagement />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App; 