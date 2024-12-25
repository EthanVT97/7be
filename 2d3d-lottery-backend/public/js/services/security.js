import config from '../config.js';
import { api } from './api.js';
import ErrorHandler from './errorHandler.js';

class SecurityService {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Login form submission
        document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });

        // Register form submission
        document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleRegister();
        });
    }

    async checkAuthStatus() {
        const token = localStorage.getItem('token');
        if (!token) {
            this.updateAuthUI(false);
            return;
        }
        try {
            // Verify token with backend
            await api.call('/auth/verify');
            this.updateAuthUI(true);
        } catch (error) {
            localStorage.removeItem('token');
            this.updateAuthUI(false);
        }
    }

    updateAuthUI(isAuthenticated) {
        document.querySelectorAll('.auth-required').forEach(el => 
            el.style.display = isAuthenticated ? '' : 'none'
        );
        document.querySelectorAll('.guest-only').forEach(el => 
            el.style.display = isAuthenticated ? 'none' : ''
        );
    }

    showLoginModal() {
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
    }

    showRegisterModal() {
        const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
        registerModal.show();
    }

    async handleLogin() {
        try {
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            const response = await api.call(config.ENDPOINTS.AUTH.LOGIN, 'POST', {
                username,
                password
            });

            if (response.token) {
                localStorage.setItem('token', response.token);
                this.updateAuthUI(true);
                bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
                ErrorHandler.handle({ message: 'Logged in successfully', type: 'success' });
            }
        } catch (error) {
            ErrorHandler.handle(error);
        }
    }

    async handleRegister() {
        try {
            const username = document.getElementById('registerUsername').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }

            const response = await api.call(config.ENDPOINTS.AUTH.REGISTER, 'POST', {
                username,
                email,
                password
            });

            if (response.success) {
                bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
                ErrorHandler.handle({ 
                    message: 'Registration successful! Please login.', 
                    type: 'success' 
                });
                this.showLoginModal();
            }
        } catch (error) {
            ErrorHandler.handle(error);
        }
    }

    async logout() {
        try {
            await api.call(config.ENDPOINTS.AUTH.LOGOUT, 'POST');
            localStorage.removeItem('token');
            this.updateAuthUI(false);
            ErrorHandler.handle({ message: 'Logged out successfully' });
        } catch (error) {
            ErrorHandler.handle(error);
        }
    }
}

export const security = new SecurityService();
