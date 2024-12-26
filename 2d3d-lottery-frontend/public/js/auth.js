import config from './config.js';
import { ApiService } from './services/api.service.js';

const api = new ApiService();

class AuthHandler {
    constructor() {
        this.bindEvents();
        this.checkAuth();
    }

    showLoginModal() {
        const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
        if (registerModal) {
            registerModal.hide();
        }
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
    }

    showRegisterModal() {
        const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        if (loginModal) {
            loginModal.hide();
        }
        const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
        registerModal.show();
    }

    togglePassword(inputId) {
        const input = document.getElementById(inputId);
        const icon = event.currentTarget.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }

    showAlert(message, type = 'info') {
        const alertContainer = document.getElementById('alertContainer');
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show`;
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        alertContainer.appendChild(alert);
        setTimeout(() => alert.remove(), 5000);
    }

    bindEvents() {
        // Login form
        document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const response = await api.login(username, password);
                if (response.success) {
                    // Store token
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('user', JSON.stringify(response.user));
                    
                    // Hide modal
                    bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
                    
                    // Show success message
                    this.showAlert('အောင်မြင်စွာ ဝင်ရောက်ပြီးပါပြီ', 'success');
                    
                    // Reload page after 1 second
                    setTimeout(() => window.location.reload(), 1000);
                } else {
                    this.showAlert(response.message, 'danger');
                }
            } catch (error) {
                this.showAlert('စနစ်တွင် အမှားတစ်ခု ဖြစ်ပေါ်နေပါသည်။', 'danger');
                console.error('Login error:', error);
            }
        });

        // Register form
        document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('registerUsername').value;
            const email = document.getElementById('registerEmail').value;
            const phone = document.getElementById('registerPhone').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                this.showAlert('စကားဝှက်များ မတူညီပါ', 'danger');
                return;
            }
            
            try {
                const response = await api.register({ username, email, phone, password });
                if (response.success) {
                    // Hide register modal
                    bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
                    
                    // Show success message
                    this.showAlert('အကောင့်အသစ် ဖွင့်လှစ်ပြီးပါပြီ', 'success');
                    
                    // Show login modal after 1 second
                    setTimeout(() => this.showLoginModal(), 1000);
                } else {
                    this.showAlert(response.message, 'danger');
                }
            } catch (error) {
                this.showAlert(error.message || 'စနစ်တွင် အမှားတစ်ခု ဖြစ်ပေါ်နေပါသည်။', 'danger');
                console.error('Registration error:', error);
            }
        });

        // Logout button
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.reload();
        });
    }

    async checkAuth() {
        const token = localStorage.getItem('token');
        if (!token) {
            this.updateUI(false);
            return;
        }

        try {
            const response = await api.getUserProfile();
            if (response.success) {
                this.updateUI(true, response.user);
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                this.updateUI(false);
            }
        } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.updateUI(false);
        }
    }

    updateUI(isLoggedIn, user = null) {
        const authButtons = document.getElementById('authButtons');
        const userInfo = document.getElementById('userInfo');
        const restrictedContent = document.querySelectorAll('.auth-required');

        if (isLoggedIn && user) {
            authButtons.style.display = 'none';
            userInfo.style.display = 'block';
            userInfo.querySelector('.username').textContent = user.username;
            userInfo.querySelector('.balance').textContent = user.balance.toLocaleString();
            restrictedContent.forEach(el => el.style.display = 'block');
        } else {
            authButtons.style.display = 'block';
            userInfo.style.display = 'none';
            restrictedContent.forEach(el => el.style.display = 'none');
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    window.auth = new AuthHandler();
});
