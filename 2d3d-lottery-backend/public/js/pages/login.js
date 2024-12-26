import { ApiService } from '../services/api.service.js';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('error');

    try {
        const response = await ApiService.login({ phone, password });
        
        if (response.status === 'success') {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            
            // Redirect based on role
            switch (response.user.role) {
                case 'admin':
                    window.location.href = '/admin/dashboard.html';
                    break;
                case 'agent':
                    window.location.href = '/agent/dashboard.html';
                    break;
                case 'seller':
                    window.location.href = '/seller/dashboard.html';
                    break;
            }
        } else {
            errorDiv.textContent = response.message;
        }
    } catch (error) {
        errorDiv.textContent = 'Login failed. Please try again.';
    }
}); 