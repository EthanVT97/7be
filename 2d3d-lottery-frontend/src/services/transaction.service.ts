import api from './api';

interface CreateTransactionData {
  type: 'deposit' | 'withdrawal';
  amount: number;
  paymentMethod: 'kpay' | 'wavepay' | 'ayapay' | 'cbpay';
  paymentAccount: string;
  paymentAccountName: string;
  transactionRef?: string;
  remark?: string;
}

export const transactionService = {
  async getTransactions() {
    const response = await api.get('/transactions');
    return response.data;
  },

  async createTransaction(data: CreateTransactionData) {
    const response = await api.post('/transactions', data);
    return response.data;
  },

  async getTransaction(id: number) {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  async cancelTransaction(id: number) {
    const response = await api.post(`/transactions/${id}/cancel`);
    return response.data;
  },

  async getTransactionHistory() {
    const response = await api.get('/transactions/history');
    return response.data;
  }
}; 