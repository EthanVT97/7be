const API = {
    baseURL: process.env.API_BASE_URL || 'http://localhost:8000',
    
    // Test API connection
    async testConnection() {
        try {
            const response = await fetch(`${this.baseURL}/health.php`);
            const data = await response.json();
            return data.healthy;
        } catch (error) {
            console.error('API connection test failed:', error);
            return false;
        }
    },
    
    // Auth endpoints
    async login(username, password) {
        const response = await fetch(`${this.baseURL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        return await response.json();
    },
    
    // Protected endpoints
    async getUserProfile() {
        const token = localStorage.getItem('token');
        const response = await fetch(`${this.baseURL}/api/user/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return await response.json();
    }
    
    // Add other API methods...
};

// Test connection on page load
document.addEventListener('DOMContentLoaded', async () => {
    const isConnected = await API.testConnection();
    if (!isConnected) {
        showAlert('API ဆာဗာနှင့် ချိတ်ဆက်၍မရပါ။', 'danger');
    }
}); 