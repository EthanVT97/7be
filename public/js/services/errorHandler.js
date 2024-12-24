import { monitoring } from './monitoring.js';

class ErrorHandler {
    static ERROR_TYPES = {
        NETWORK: 'NETWORK_ERROR',
        AUTH: 'AUTH_ERROR',
        VALIDATION: 'VALIDATION_ERROR',
        API: 'API_ERROR',
        RATE_LIMIT: 'RATE_LIMIT_ERROR',
        FIREBASE: 'FIREBASE_ERROR',
        UNKNOWN: 'UNKNOWN_ERROR'
    };

    static ERROR_MESSAGES = {
        [this.ERROR_TYPES.NETWORK]: {
            offline: 'No internet connection. Please check your network.',
            timeout: 'Request timed out. Please try again.',
            cors: 'Cross-origin request failed.',
        },
        [this.ERROR_TYPES.AUTH]: {
            invalid_token: 'Your session has expired. Please log in again.',
            unauthorized: 'You are not authorized to perform this action.',
            firebase_auth: 'Firebase authentication failed.',
        },
        [this.ERROR_TYPES.API]: {
            server_error: 'Server error occurred. Please try again later.',
            maintenance: 'Service is under maintenance.',
            invalid_response: 'Invalid response from server.',
        }
    };

    static handleError(error, context = {}) {
        const errorDetails = this.categorizeError(error);
        
        // Log error with monitoring service
        monitoring.logError(error, errorDetails.type, {
            ...context,
            errorDetails,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        });

        // Handle specific error types
        switch (errorDetails.type) {
            case this.ERROR_TYPES.NETWORK:
                this.handleNetworkError(errorDetails);
                break;
            case this.ERROR_TYPES.AUTH:
                this.handleAuthError(errorDetails);
                break;
            case this.ERROR_TYPES.RATE_LIMIT:
                this.handleRateLimitError(errorDetails);
                break;
            case this.ERROR_TYPES.FIREBASE:
                this.handleFirebaseError(errorDetails);
                break;
            default:
                this.handleGenericError(errorDetails);
        }

        return errorDetails;
    }

    static categorizeError(error) {
        // Network errors
        if (!navigator.onLine || error.name === 'NetworkError') {
            return {
                type: this.ERROR_TYPES.NETWORK,
                code: 'offline',
                message: this.ERROR_MESSAGES[this.ERROR_TYPES.NETWORK].offline
            };
        }

        // Timeout errors
        if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
            return {
                type: this.ERROR_TYPES.NETWORK,
                code: 'timeout',
                message: this.ERROR_MESSAGES[this.ERROR_TYPES.NETWORK].timeout
            };
        }

        // Firebase errors
        if (error.code?.startsWith('auth/')) {
            return {
                type: this.ERROR_TYPES.FIREBASE,
                code: error.code,
                message: this.getFirebaseErrorMessage(error.code)
            };
        }

        // API errors
        if (error.status) {
            switch (error.status) {
                case 401:
                    return {
                        type: this.ERROR_TYPES.AUTH,
                        code: 'invalid_token',
                        message: this.ERROR_MESSAGES[this.ERROR_TYPES.AUTH].invalid_token
                    };
                case 403:
                    return {
                        type: this.ERROR_TYPES.AUTH,
                        code: 'unauthorized',
                        message: this.ERROR_MESSAGES[this.ERROR_TYPES.AUTH].unauthorized
                    };
                case 429:
                    return {
                        type: this.ERROR_TYPES.RATE_LIMIT,
                        code: 'rate_limit_exceeded',
                        message: 'Too many requests. Please try again later.'
                    };
                case 503:
                    return {
                        type: this.ERROR_TYPES.API,
                        code: 'maintenance',
                        message: this.ERROR_MESSAGES[this.ERROR_TYPES.API].maintenance
                    };
                default:
                    return {
                        type: this.ERROR_TYPES.API,
                        code: 'server_error',
                        message: this.ERROR_MESSAGES[this.ERROR_TYPES.API].server_error
                    };
            }
        }

        // Unknown errors
        return {
            type: this.ERROR_TYPES.UNKNOWN,
            code: 'unknown',
            message: error.message || 'An unknown error occurred.'
        };
    }

    static getFirebaseErrorMessage(code) {
        const messages = {
            'auth/user-not-found': 'No account found with this email.',
            'auth/wrong-password': 'Incorrect password.',
            'auth/email-already-in-use': 'This email is already registered.',
            'auth/invalid-email': 'Invalid email address.',
            'auth/weak-password': 'Password is too weak.',
            'auth/network-request-failed': 'Network error. Please check your connection.',
            'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
            'auth/popup-closed-by-user': 'Sign-in popup was closed.',
            'auth/operation-not-allowed': 'This sign-in method is not enabled.',
            'auth/invalid-credential': 'Invalid credentials.',
            'auth/account-exists-with-different-credential': 'An account already exists with this email.',
            'auth/requires-recent-login': 'Please log in again to continue.',
            'auth/user-disabled': 'This account has been disabled.',
            'auth/user-token-expired': 'Your session has expired. Please log in again.',
            'auth/web-storage-unsupported': 'Web storage is not supported by your browser.',
            'auth/invalid-api-key': 'Invalid API configuration.',
            'auth/app-deleted': 'Application has been deleted.',
            'auth/invalid-user-token': 'Invalid user token.',
            'auth/user-token-mismatch': 'User token mismatch.',
            'auth/invalid-auth-event': 'Invalid authentication event.',
            'auth/invalid-verification-code': 'Invalid verification code.',
            'auth/invalid-verification-id': 'Invalid verification ID.',
            'auth/custom-token-mismatch': 'Token mismatch.',
            'auth/invalid-custom-token': 'Invalid custom token.',
        };
        return messages[code] || 'Authentication error occurred.';
    }

    static handleNetworkError(errorDetails) {
        // Implement offline detection and auto-retry
        if (errorDetails.code === 'offline') {
            this.setupOnlineListener();
        }
    }

    static handleAuthError(errorDetails) {
        // Clear invalid tokens and redirect to login
        if (errorDetails.code === 'invalid_token') {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
    }

    static handleRateLimitError(errorDetails) {
        // Implement exponential backoff
        const retryCount = parseInt(localStorage.getItem('retryCount') || '0');
        const backoffTime = Math.min(1000 * Math.pow(2, retryCount), 30000);
        
        localStorage.setItem('retryCount', (retryCount + 1).toString());
        setTimeout(() => {
            localStorage.setItem('retryCount', '0');
        }, backoffTime);
    }

    static handleFirebaseError(errorDetails) {
        // Handle Firebase-specific errors
        if (errorDetails.code === 'auth/requires-recent-login') {
            // Force re-authentication
            window.firebaseAuth.signOut().then(() => {
                window.location.href = '/login';
            });
        }
    }

    static handleGenericError(errorDetails) {
        console.error('Unhandled error:', errorDetails);
    }

    static setupOnlineListener() {
        window.addEventListener('online', () => {
            window.location.reload();
        });
    }
}

export default ErrorHandler;
