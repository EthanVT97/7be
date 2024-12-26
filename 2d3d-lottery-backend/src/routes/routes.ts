interface Route {
  path: string;
  name: string;
}

interface Routes {
  // Public routes
  home: Route;
  login: Route;
  register: Route;

  // Protected routes
  dashboard: Route;
  profile: Route;
  betting: Route;
  transactions: Route;
  wallet: Route;

  // Admin routes
  adminDashboard: Route;
  adminBets: Route;
  adminTransactions: Route;
  adminUsers: Route;
  adminSettings: Route;
}

export const routes: Routes = {
  // Public routes
  home: {
    path: '/',
    name: 'Home',
  },
  login: {
    path: '/login',
    name: 'Login',
  },
  register: {
    path: '/register',
    name: 'Register',
  },

  // Protected routes
  dashboard: {
    path: '/dashboard',
    name: 'Dashboard',
  },
  profile: {
    path: '/profile',
    name: 'Profile',
  },
  betting: {
    path: '/betting',
    name: 'Place Bet',
  },
  transactions: {
    path: '/transactions',
    name: 'Transactions',
  },
  wallet: {
    path: '/wallet',
    name: 'Wallet',
  },

  // Admin routes
  adminDashboard: {
    path: '/admin',
    name: 'Admin Dashboard',
  },
  adminBets: {
    path: '/admin/bets',
    name: 'Manage Bets',
  },
  adminTransactions: {
    path: '/admin/transactions',
    name: 'Manage Transactions',
  },
  adminUsers: {
    path: '/admin/users',
    name: 'Manage Users',
  },
  adminSettings: {
    path: '/admin/settings',
    name: 'Settings',
  },
}; 