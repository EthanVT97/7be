import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://twod3dbe.onrender.com';
const API_TIMEOUT = Number(process.env.REACT_APP_API_TIMEOUT) || 30000;

const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const login = (phone: string, password: string) => 
  api.post('/api/auth/login', { phone, password });

export const register = (name: string, phone: string, password: string) => 
  api.post('/api/auth/register', { name, phone, password });

// Betting APIs
export const place2DBet = (numbers: string[], amounts: number[]) => 
  api.post('/api/bets/2d', { numbers, amounts });

export const place3DBet = (numbers: string[], amounts: number[]) => 
  api.post('/api/bets/3d', { numbers, amounts });

export const getBettingHistory = (page = 1, limit = 10) => 
  api.get(`/api/bets/history?page=${page}&limit=${limit}`);

// Transaction APIs
export const deposit = (amount: number, transactionId: string) => 
  api.post('/api/transactions/deposit', { amount, transactionId });

export const withdraw = (amount: number, accountInfo: string) => 
  api.post('/api/transactions/withdraw', { amount, accountInfo });

// Game Status APIs
export const get2DStatus = () => 
  api.get('/api/games/2d/status');

export const get3DStatus = () => 
  api.get('/api/games/3d/status');

export default api; 