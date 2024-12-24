import config from '../config.js';
import { monitoring } from './monitoring.js';
import { security } from './security.js';

class ApiService {
    constructor() {
        this.rateLimiter = {
            requests: [],
            checkLimit() {
                const now = Date.now();
                this.requests = this.requests.filter(time => 
                    time > now - config.RATE_LIMIT.TIME_WINDOW
                );
                return this.requests.length < config.RATE_LIMIT.MAX_REQUESTS;
            },
            addRequest() {
                this.requests.push(Date.now());
            }
        };
    }

    getRetryStrategy(endpoint) {
        // Find matching endpoint configuration
        const endpointConfig = Object.values(config.ENDPOINTS).find(category => 
            Object.values(category).includes(endpoint)
        );

        switch (endpointConfig?.RETRY_STRATEGY) {
            case 'immediate':
                return { delays: [0, 0, 0] };
            case 'timeout':
                return { delays: [1000, 3000, 5000] };
            case 'backoff':
            default:
                return { delays: [1000, 2000, 4000] };
        }
    }

    async call(endpoint, method = 'GET', data = null, retryCount = 0) {
        const startTime = Date.now();
        const retryStrategy = this.getRetryStrategy(endpoint);

        try {
            // Check rate limit
            if (!this.rateLimiter.checkLimit()) {
                throw new Error('RATE_LIMIT_EXCEEDED');
            }
            this.rateLimiter.addRequest();

            // Prepare request
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };

            const token = localStorage.getItem('authToken');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            // Set up timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), config.REQUEST_TIMEOUT);

            // Make request
            const response = await fetch(`${config.API_BASE_URL}${endpoint}`, {
                method,
                headers,
                body: data ? JSON.stringify(data) : null,
                signal: controller.signal,
                credentials: 'include'
            });

            clearTimeout(timeoutId);

            // Handle response
            if (!response.ok) {
                const error = new Error(response.statusText);
                error.status = response.status;
                throw error;
            }

            const result = await response.json();

            // Log performance
            const duration = Date.now() - startTime;
            monitoring.logPerformance(endpoint, duration);

            return result;

        } catch (error) {
            // Log error
            monitoring.logError(error, endpoint, { method, retryCount });

            // Handle specific error types
            switch (error.message) {
                case 'RATE_LIMIT_EXCEEDED':
                    throw new Error('Rate limit exceeded. Please try again later.');

                case 'AbortError':
                    throw new Error('Request timeout');

                default:
                    // Handle HTTP status codes
                    switch (error.status) {
                        case 401:
                            // Try token refresh on first 401
                            if (retryCount === 0) {
                                await security.refreshToken();
                                return this.call(endpoint, method, data, retryCount + 1);
                            }
                            throw new Error('Authentication failed');

                        case 403:
                            throw new Error('Access denied');

                        case 429:
                            // Handle rate limiting with retry-after
                            const retryAfter = parseInt(response.headers.get('Retry-After')) || 5;
                            if (retryCount < config.MAX_RETRIES) {
                                await new Promise(resolve => 
                                    setTimeout(resolve, retryAfter * 1000)
                                );
                                return this.call(endpoint, method, data, retryCount + 1);
                            }
                            throw new Error('Rate limit exceeded');

                        case 500:
                        case 502:
                        case 503:
                        case 504:
                            // Retry server errors with backoff
                            if (retryCount < retryStrategy.delays.length) {
                                await new Promise(resolve => 
                                    setTimeout(resolve, retryStrategy.delays[retryCount])
                                );
                                return this.call(endpoint, method, data, retryCount + 1);
                            }
                            throw new Error('Server error. Please try again later.');

                        default:
                            throw error;
                    }
            }
        }
    }
}

export const api = new ApiService();
