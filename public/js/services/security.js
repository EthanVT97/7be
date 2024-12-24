import config from '../config.js';

class SecurityService {
    constructor() {
        this.loginAttempts = new Map();
        this.tokenRefreshTimeout = null;
        this.setupTokenRefresh();
    }

    validatePassword(password) {
        if (password.length < config.SECURITY.PASSWORD_MIN_LENGTH) {
            return { valid: false, message: 'Password too short' };
        }

        if (config.SECURITY.REQUIRE_SPECIAL_CHARS && 
            !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return { valid: false, message: 'Password must contain special characters' };
        }

        return { valid: true };
    }

    checkLoginAttempts(username) {
        const attempts = this.loginAttempts.get(username) || {
            count: 0,
            lastAttempt: 0,
            lockedUntil: 0
        };

        const now = Date.now();

        // Check if account is locked
        if (attempts.lockedUntil > now) {
            const remainingTime = Math.ceil((attempts.lockedUntil - now) / 1000);
            return { 
                allowed: false, 
                message: `Account locked. Try again in ${remainingTime} seconds`
            };
        }

        // Reset attempts if lockout period has passed
        if (now - attempts.lastAttempt > config.SECURITY.LOCKOUT_DURATION) {
            attempts.count = 0;
        }

        return { allowed: true, attempts };
    }

    recordLoginAttempt(username, success) {
        const attempts = this.loginAttempts.get(username) || {
            count: 0,
            lastAttempt: 0,
            lockedUntil: 0
        };

        attempts.lastAttempt = Date.now();

        if (!success) {
            attempts.count++;
            
            if (attempts.count >= config.SECURITY.MAX_LOGIN_ATTEMPTS) {
                attempts.lockedUntil = Date.now() + config.SECURITY.LOCKOUT_DURATION;
            }
        } else {
            // Reset on successful login
            attempts.count = 0;
            attempts.lockedUntil = 0;
        }

        this.loginAttempts.set(username, attempts);
    }

    setupTokenRefresh() {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiryTime = payload.exp * 1000; // Convert to milliseconds
            const refreshTime = expiryTime - config.SECURITY.TOKEN_REFRESH_BEFORE;

            if (Date.now() >= refreshTime) {
                this.refreshToken();
            } else {
                this.tokenRefreshTimeout = setTimeout(
                    () => this.refreshToken(), 
                    refreshTime - Date.now()
                );
            }
        } catch (error) {
            console.error('Error setting up token refresh:', error);
            localStorage.removeItem('authToken');
        }
    }

    async refreshToken() {
        try {
            const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.AUTH.REFRESH}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) throw new Error('Token refresh failed');

            const { token } = await response.json();
            localStorage.setItem('authToken', token);
            this.setupTokenRefresh();
        } catch (error) {
            console.error('Token refresh failed:', error);
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
    }

    cleanup() {
        if (this.tokenRefreshTimeout) {
            clearTimeout(this.tokenRefreshTimeout);
        }
    }
}

export const security = new SecurityService();
