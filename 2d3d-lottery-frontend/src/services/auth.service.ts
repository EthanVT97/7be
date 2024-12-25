import api from './api';

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async register(data: RegisterData) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  async updateProfile(data: Partial<RegisterData>) {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    const response = await api.put('/auth/change-password', data);
    return response.data;
  }
}; 