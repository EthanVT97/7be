import api from './api';

interface PlaceBetData {
  lotteryNumberId: number;
  amount: number;
}

export const betService = {
  async getBets() {
    const response = await api.get('/bets');
    return response.data;
  },

  async placeBet(data: PlaceBetData) {
    const response = await api.post('/bets', data);
    return response.data;
  },

  async getBet(id: number) {
    const response = await api.get(`/bets/${id}`);
    return response.data;
  },

  async cancelBet(id: number) {
    const response = await api.post(`/bets/${id}/cancel`);
    return response.data;
  },

  async getBetHistory() {
    const response = await api.get('/bets/history');
    return response.data;
  },

  async getWinningNumbers() {
    const response = await api.get('/lottery-numbers/winning');
    return response.data;
  }
}; 