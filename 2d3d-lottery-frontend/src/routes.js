const routes = {
  // Public routes
  public: {
    home: '/',
    login: '/login',
    register: '/register',
    about: '/about',
    contact: '/contact'
  },
  
  // Protected routes
  protected: {
    dashboard: '/dashboard',
    profile: '/profile',
    settings: '/settings',
    lottery: {
      list: '/lottery',
      create: '/lottery/create',
      view: '/lottery/:id'
    },
    betting: '/betting',
    transactions: '/transactions',
    wallet: '/wallet'
  },
  
  // Admin routes
  admin: {
    dashboard: '/admin/dashboard',
    users: '/admin/users',
    lottery: '/admin/lottery',
    transactions: '/admin/transactions',
    settings: '/admin/settings'
  },
  
  // API routes
  api: {
    base: 'https://twod3dbe.onrender.com',
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      refresh: '/api/auth/refresh',
      logout: '/api/auth/logout'
    },
    lottery: {
      list: '/api/lottery',
      create: '/api/lottery/create',
      update: '/api/lottery/update',
      delete: '/api/lottery/delete'
    },
    betting: {
      place: '/api/betting/place',
      history: '/api/betting/history'
    },
    wallet: {
      balance: '/api/wallet/balance',
      deposit: '/api/wallet/deposit',
      withdraw: '/api/wallet/withdraw'
    },
    status: '/api/status',
    health: '/health'
  }
};

export default routes; 