import config from '../config.js';
import ErrorHandler from './errorHandler.js';

class ApiService {
    async call(endpoint, method = 'GET', data = null) {
        try {
            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            };

            if (data && method !== 'GET') {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(config.API_BASE_URL + endpoint, options);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'API Error');
            }

            return result;
        } catch (error) {
            ErrorHandler.handle(error);
            throw error;
        }
    }
}

export const api = new ApiService();
