import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  timeout: Number(process.env.REACT_APP_API_TIMEOUT) || 30000,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Services
export const authService = {
  login: async (phone: string, password: string) => {
    const response = await api.post('/auth/login', { phone, password });
    return response.data;
  },
  register: async (phone: string, password: string, name: string) => {
    const response = await api.post('/auth/register', { phone, password, name });
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
  },
};

// User Services
export const userService = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },
  getBalance: async () => {
    const response = await api.get('/user/balance');
    return response.data;
  },
  getTransactions: async () => {
    const response = await api.get('/user/transactions');
    return response.data;
  },
};

// Lottery Services
export const lotteryService = {
  placeBet: async (data: {
    type: '2D' | '3D';
    number: string;
    amount: number;
    timeSlot: 'morning' | 'evening';
  }) => {
    const response = await api.post('/lottery/bet', data);
    return response.data;
  },
  getBetHistory: async () => {
    const response = await api.get('/lottery/history');
    return response.data;
  },
  getResults: async (type: '2D' | '3D') => {
    const response = await api.get(`/lottery/results/${type}`);
    return response.data;
  },
};

// Payment Services
export const paymentService = {
  deposit: async (amount: number, paymentMethod: string) => {
    const response = await api.post('/payment/deposit', { amount, paymentMethod });
    return response.data;
  },
  withdraw: async (amount: number, bankInfo: any) => {
    const response = await api.post('/payment/withdraw', { amount, bankInfo });
    return response.data;
  },
}; 