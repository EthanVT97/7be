import { API_CONFIG } from '../config/api.config.js';

export class ApiService {
    static async request(endpoint, options = {}) {
        try {
            const token = localStorage.getItem('token');
            
            const defaultOptions = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            };

            const response = await fetch(API_CONFIG.BASE_URL + endpoint, {
                ...defaultOptions,
                ...options
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login.html';
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Auth Methods
    static async login(credentials) {
        return this.request(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    static async register(userData) {
        return this.request(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    static async logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    }

    // User Methods
    static async getUsers() {
        return this.request(API_CONFIG.ENDPOINTS.USERS.LIST);
    }

    static async createUser(userData) {
        return this.request(API_CONFIG.ENDPOINTS.USERS.CREATE, {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    static async updateUser(userId, userData) {
        return this.request(`${API_CONFIG.ENDPOINTS.USERS.UPDATE}/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    }

    static async deleteUser(userId) {
        return this.request(`${API_CONFIG.ENDPOINTS.USERS.DELETE}/${userId}`, {
            method: 'DELETE'
        });
    }

    // Sales Methods
    static async getSales() {
        return this.request(API_CONFIG.ENDPOINTS.SALES.LIST);
    }

    static async createSale(saleData) {
        return this.request(API_CONFIG.ENDPOINTS.SALES.CREATE, {
            method: 'POST',
            body: JSON.stringify(saleData)
        });
    }

    static async updateSale(saleId, saleData) {
        return this.request(`${API_CONFIG.ENDPOINTS.SALES.UPDATE}/${saleId}`, {
            method: 'PUT',
            body: JSON.stringify(saleData)
        });
    }

    static async deleteSale(saleId) {
        return this.request(`${API_CONFIG.ENDPOINTS.SALES.DELETE}/${saleId}`, {
            method: 'DELETE'
        });
    }

    // Numbers Methods
    static async getNumbers() {
        return this.request(API_CONFIG.ENDPOINTS.NUMBERS.LIST);
    }

    static async createNumber(numberData) {
        return this.request(API_CONFIG.ENDPOINTS.NUMBERS.CREATE, {
            method: 'POST',
            body: JSON.stringify(numberData)
        });
    }

    // Health Check Methods
    static async checkHealth() {
        return this.request(API_CONFIG.ENDPOINTS.HEALTH);
    }

    static async testDatabase() {
        return this.request(API_CONFIG.ENDPOINTS.TEST);
    }

    // Utility Methods
    static isAuthenticated() {
        return !!localStorage.getItem('token');
    }

    static getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    static hasRole(role) {
        const user = this.getCurrentUser();
        return user && user.role === role;
    }
} 