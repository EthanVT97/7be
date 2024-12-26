<<<<<<< HEAD
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
=======
function showLoginModal() {
    const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
    if (registerModal) {
        registerModal.hide();
    }
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
}

function showRegisterModal() {
    const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    if (loginModal) {
        loginModal.hide();
    }
    const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
    registerModal.show();
}

function togglePassword(inputId) {
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

// Form validation and submission
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        const response = await fetch(`${config.API_BASE_URL}/auth/login.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        
        if (result.success) {
            // Store token
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
            
            // Hide modal
            bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
            
            // Show success message
            showAlert(result.message, 'success');
            
            // Reload page after 1 second
            setTimeout(() => window.location.reload(), 1000);
        } else {
            showAlert(result.message, 'danger');
        }
        
    } catch (error) {
        showAlert('စနစ်တွင် အမှားတစ်ခု ဖြစ်ပေါ်နေပါသည်။', 'danger');
        console.error('Login error:', error);
    }
});

document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const phone = document.getElementById('registerPhone').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            throw new Error('စကားဝှက်များ မတူညီပါ');
        }
        
        const response = await fetch('/api/auth/register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, phone, password })
        });

        const result = await response.json();
        
        if (result.success) {
            // Hide register modal
            bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
            
            // Show success message
            showAlert(result.message, 'success');
            
            // Show login modal after 1 second
            setTimeout(() => showLoginModal(), 1000);
        } else {
            showAlert(result.message, 'danger');
        }
        
    } catch (error) {
        showAlert(error.message || 'စနစ်တွင် အမှားတစ်ခု ဖြစ်ပေါ်နေပါသည်။', 'danger');
        console.error('Registration error:', error);
    }
});

function showAlert(message, type = 'info') {
>>>>>>> aa145722f6a011a22d3e9f2b280787ab3c45a8fc
    const alertContainer = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    alertContainer.appendChild(alert);
    setTimeout(() => alert.remove(), 5000);
<<<<<<< HEAD
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
=======
} 
>>>>>>> aa145722f6a011a22d3e9f2b280787ab3c45a8fc
