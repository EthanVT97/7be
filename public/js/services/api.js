import config from '../config.js';
import ErrorHandler from './errorHandler.js';
import { monitoring } from './monitoring.js';

class ApiService {
    constructor() {
        this.baseURL = config.API_BASE_URL;
        this.retryAttempts = 0;
    }

    async call(endpoint, method = 'GET', data = null) {
        const startTime = performance.now();
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'include'
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        // Add session token if available
        const sessionToken = localStorage.getItem('sessionToken');
        if (sessionToken) {
            options.headers['Authorization'] = `Bearer ${sessionToken}`;
        }

        try {
            const response = await this._fetchWithTimeout(
                `${this.baseURL}${endpoint}`,
                options
            );

            const endTime = performance.now();
            monitoring.logApiCall(endpoint, endTime - startTime, response.status);

            if (!response.ok) {
                throw await this._handleHttpError(response);
            }

            return await response.json();
        } catch (error) {
            if (this.retryAttempts < config.MAX_RETRY_ATTEMPTS) {
                this.retryAttempts++;
                return await this.call(endpoint, method, data);
            }
            
            this.retryAttempts = 0;
            throw error;
        }
    }

    async _fetchWithTimeout(url, options) {
        const controller = new AbortController();
        const timeout = setTimeout(() => {
            controller.abort();
        }, config.REQUEST_TIMEOUT);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeout);
            return response;
        } catch (error) {
            clearTimeout(timeout);
            throw error;
        }
    }

    async _handleHttpError(response) {
        const error = new Error();
        error.status = response.status;
        
        try {
            const data = await response.json();
            error.message = data.message || response.statusText;
        } catch {
            error.message = response.statusText;
        }

        monitoring.logError(error);
        return error;
    }

    // Authentication methods
    async login(username, password) {
        const response = await this.call(config.ENDPOINTS.AUTH.LOGIN, 'POST', {
            username,
            password
        });

        if (response.token) {
            localStorage.setItem('sessionToken', response.token);
            document.dispatchEvent(new CustomEvent('authStateChanged', {
                detail: { isAuthenticated: true }
            }));
        }

        return response;
    }

    async logout() {
        await this.call(config.ENDPOINTS.AUTH.LOGOUT, 'POST');
        localStorage.removeItem('sessionToken');
        document.dispatchEvent(new CustomEvent('authStateChanged', {
            detail: { isAuthenticated: false }
        }));
    }

    async register(userData) {
        return await this.call(config.ENDPOINTS.AUTH.REGISTER, 'POST', userData);
    }

    isAuthenticated() {
        return !!localStorage.getItem('sessionToken');
    }
}

export const api = new ApiService();
