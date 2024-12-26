import config from '../config.js';

export class ApiService {
    static async request(endpoint, options = {}) {
        const defaultOptions = {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem(config.AUTH.TOKEN_KEY)}`
            }
        };

        try {
            const response = await fetch(`${config.API_URL}${endpoint}`, {
                ...defaultOptions,
                ...options
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'ဆာဗာနှင့် ဆက်သွယ်မှု မအောင်မြင်ပါ');
            }

            return await response.json();
        } catch (error) {
            console.error('API တောင်းဆိုမှု မအောင်မြင်ပါ:', error);
            throw error;
        }
    }

    static async login(credentials) {
        const data = await this.request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        
        if (data.token) {
            localStorage.setItem(config.AUTH.TOKEN_KEY, data.token);
            localStorage.setItem(config.AUTH.USER_KEY, JSON.stringify(data.user));
        }
        
        return data;
    }

    static async logout() {
        await this.request('/api/auth/logout', { method: 'POST' });
        localStorage.removeItem(config.AUTH.TOKEN_KEY);
        localStorage.removeItem(config.AUTH.USER_KEY);
        window.location.href = '/login';
    }

    static getCurrentUser() {
        const userData = localStorage.getItem(config.AUTH.USER_KEY);
        return userData ? JSON.parse(userData) : null;
    }
} 