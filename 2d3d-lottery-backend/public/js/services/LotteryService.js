import config from '../config.js';
import ErrorHandler from './errorHandler.js';
import { monitoring } from './monitoring.js';

class LotteryService {
    constructor() {
        this.baseUrl = config.API_BASE_URL;
        this.rateLimiter = {
            requests: 0,
            lastReset: Date.now(),
            limit: config.RATE_LIMIT.REQUESTS_PER_MINUTE
        };
    }

    // Real-time lottery results updates
    async getLiveResults() {
        try {
            this.checkRateLimit();
            const response = await fetch(`${this.baseUrl}/lottery/live`, {
                headers: this.getHeaders()
            });
            return this.handleResponse(response);
        } catch (error) {
            ErrorHandler.handle(error);
            throw error;
        }
    }

    // File upload with security checks
    async uploadFile(file, type) {
        try {
            if (!this.validateFile(file)) {
                throw new Error('Invalid file type or size');
            }

            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', type);

            const response = await fetch(`${this.baseUrl}/upload`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: formData
            });

            return this.handleResponse(response);
        } catch (error) {
            ErrorHandler.handle(error);
            throw error;
        }
    }

    // Admin result management
    async updateResults(data) {
        try {
            if (!this.isAdmin()) {
                throw new Error('Unauthorized access');
            }

            const response = await fetch(`${this.baseUrl}/admin/results`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(data)
            });

            return this.handleResponse(response);
        } catch (error) {
            ErrorHandler.handle(error);
            throw error;
        }
    }

    // Multi-language support
    setLanguage(lang) {
        const supportedLanguages = ['en', 'my'];
        if (!supportedLanguages.includes(lang)) {
            throw new Error('Unsupported language');
        }
        localStorage.setItem('preferred_language', lang);
        this.translateUI();
    }

    // Helper methods
    validateFile(file) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        return file.size <= maxSize && allowedTypes.includes(file.type);
    }

    checkRateLimit() {
        const now = Date.now();
        if (now - this.rateLimiter.lastReset > 60000) {
            this.rateLimiter.requests = 0;
            this.rateLimiter.lastReset = now;
        }

        if (this.rateLimiter.requests >= this.rateLimiter.limit) {
            throw new Error('Rate limit exceeded');
        }

        this.rateLimiter.requests++;
    }

    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Accept-Language': localStorage.getItem('preferred_language') || 'en'
        };
    }

    getAuthHeaders() {
        return {
            ...this.getHeaders(),
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        };
    }

    async handleResponse(response) {
        const data = await response.json();
        
        if (!response.ok) {
            monitoring.logError({
                status: response.status,
                message: data.message,
                endpoint: response.url
            });
            throw new Error(data.message || 'API Error');
        }

        monitoring.logSuccess({
            endpoint: response.url,
            responseTime: performance.now()
        });

        return data;
    }

    isAdmin() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user.role === 'admin';
    }

    translateUI() {
        const lang = localStorage.getItem('preferred_language') || 'en';
        const elements = document.querySelectorAll('[data-translate]');
        
        elements.forEach(async element => {
            const key = element.getAttribute('data-translate');
            try {
                const translation = await this.fetchTranslation(key, lang);
                element.textContent = translation;
            } catch (error) {
                ErrorHandler.handle(error);
            }
        });
    }

    async fetchTranslation(key, lang) {
        const response = await fetch(`${this.baseUrl}/translations/${lang}/${key}`);
        const data = await response.json();
        return data.translation;
    }
}

export default new LotteryService(); 