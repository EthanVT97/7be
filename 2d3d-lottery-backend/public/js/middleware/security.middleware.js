export class SecurityMiddleware {
    constructor() {
        this.csrfToken = this.generateCSRFToken();
    }

    // CSRF Protection
    generateCSRFToken() {
        return Math.random().toString(36).substring(2);
    }

    // XSS Prevention
    sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    // Input Validation
    validatePhoneNumber(phone) {
        return /^(09|\+?959)\d{7,9}$/.test(phone);
    }

    validateAmount(amount) {
        return !isNaN(amount) && amount > 0;
    }

    // Rate Limiting
    rateLimitRequest() {
        const now = Date.now();
        const lastRequest = localStorage.getItem('lastRequest');
        
        if (lastRequest && now - parseInt(lastRequest) < 1000) { // 1 second delay
            return false;
        }
        
        localStorage.setItem('lastRequest', now.toString());
        return true;
    }
} 