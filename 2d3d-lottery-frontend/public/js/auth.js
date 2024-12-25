import config from './config.js';
import { ApiService } from './services/api.service.js';

const api = new ApiService();

// Show/hide password toggle
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === 'password' ? 'text' : 'password';
}

// Show alerts
function showAlert(message, type = 'success') {
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

class AuthHandler {
    constructor() {
        this.bindEvents();
        this.checkAuth();
    }

    bindEvents() {
        // Login form
        document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = e.target.username.value;
            const password = e.target.password.value;

            try {
                const response = await api.login(username, password);
                if (response.success) {
                    localStorage.setItem('token', response.token);
                    showAlert('အောင်မြင်စွာ ဝင်ရောက်ပြီးပါပြီ', 'success');
                    location.reload();
                }
            } catch (error) {
                showAlert(error.message || 'Login failed', 'danger');
            }
        });

        // Register form
        document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = {
                username: e.target.username.value,
                password: e.target.password.value,
                phone: e.target.phone.value
            };

            try {
                const response = await api.register(formData);
                if (response.success) {
                    showAlert('အကောင့်အသစ် ဖွင့်လှစ်ပြီးပါပြီ', 'success');
                    // Auto login after registration
                    const loginResponse = await api.login(formData.username, formData.password);
                    if (loginResponse.success) {
                        localStorage.setItem('token', loginResponse.token);
                        location.reload();
                    }
                }
            } catch (error) {
                showAlert(error.message || 'Registration failed', 'danger');
            }
        });

        // Logout button
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            localStorage.removeItem('token');
            location.reload();
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
                this.updateUI(false);
            }
        } catch (error) {
            localStorage.removeItem('token');
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
    new AuthHandler();
}); 