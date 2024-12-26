import { AuthService } from '../services/auth.service.js';
import { showNotification } from '../utils/notification.utils.js';

export class AuthHandler {
    // Login Form ကို စီမံခြင်း
    static async handleLogin(event) {
        event.preventDefault();
        const form = event.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const loadingOverlay = document.getElementById('loadingOverlay');
        const alertBox = document.getElementById('alertBox');
        
        // Reset previous errors
        alertBox.classList.add('d-none');
        form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        
        try {
            const phone = form.phone.value.trim();
            const password = form.password.value;

            // Form validation
            let hasError = false;
            
            if (!this.validatePhone(phone)) {
                form.phone.classList.add('is-invalid');
                hasError = true;
            }
            
            if (password.length < 6) {
                form.password.classList.add('is-invalid');
                hasError = true;
            }
            
            if (hasError) {
                return;
            }

            // Loading state
            submitBtn.disabled = true;
            loadingOverlay.classList.remove('d-none');
            
            // Login request
            await AuthService.login(phone, password);
            
            // Success - redirect to dashboard
            window.location.href = '/dashboard';

        } catch (error) {
            // Show error message
            alertBox.textContent = error.message || 'အကောင့်ဝင်ရောက်ရန် မအောင်မြင်ပါ';
            alertBox.classList.remove('d-none');
            
            // Log error for debugging
            console.error('Login error:', error);
            
        } finally {
            // Reset loading state
            submitBtn.disabled = false;
            loadingOverlay.classList.add('d-none');
        }
    }

    // Register Form ကို စီမံခြင်း
    static async handleRegister(event) {
        event.preventDefault();
        const form = event.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const loadingOverlay = document.getElementById('loadingOverlay');
        const alertBox = document.getElementById('alertBox');
        
        // Reset previous errors
        alertBox.classList.add('d-none');
        form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

        try {
            const name = form.name.value.trim();
            const phone = form.phone.value.trim();
            const password = form.password.value;
            const confirmPassword = form.confirmPassword.value;

            // Form validation
            let hasError = false;
            
            if (name.length < 2) {
                form.name.classList.add('is-invalid');
                hasError = true;
            }
            
            if (!this.validatePhone(phone)) {
                form.phone.classList.add('is-invalid');
                hasError = true;
            }
            
            if (password.length < 6) {
                form.password.classList.add('is-invalid');
                hasError = true;
            }
            
            if (password !== confirmPassword) {
                form.confirmPassword.classList.add('is-invalid');
                hasError = true;
            }
            
            if (hasError) {
                return;
            }

            // Loading state
            submitBtn.disabled = true;
            loadingOverlay.classList.remove('d-none');

            // Register request
            await AuthService.register({ name, phone, password });
            
            // Show success message
            showNotification('အကောင့်ဖွင့်ခြင်း အောင်မြင်ပါသည်။ အကောင့်ဝင်ရောက်နိုင်ပါပြီ', 'success');
            
            // Redirect to login
            window.location.href = '/login';

        } catch (error) {
            // Show error message
            alertBox.textContent = error.message || 'အကောင့်ဖွင့်ရန် မအောင်မြင်ပါ';
            alertBox.classList.remove('d-none');
            
            // Log error for debugging
            console.error('Registration error:', error);
            
        } finally {
            // Reset loading state
            submitBtn.disabled = false;
            loadingOverlay.classList.add('d-none');
        }
    }

    // ဖုန်းနံပါတ် စစ်ဆေးခြင်း
    static validatePhone(phone) {
        const phoneRegex = /^(09|\+?959)\d{7,9}$/;
        return phoneRegex.test(phone.replace(/\s+/g, ''));
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => AuthHandler.handleLogin.call(AuthHandler, e));
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => AuthHandler.handleRegister.call(AuthHandler, e));
    }
}); 