class ConnectionTester {
    constructor() {
        this.testConnection();
    }

    async testConnection() {
        try {
            // Test API connection
            const healthCheck = await fetch(`${api.baseUrl}/health.php`);
            const healthData = await healthCheck.json();

            if (!healthData.healthy) {
                this.showError('API server is not healthy');
                console.error('Health check failed:', healthData);
                return;
            }

            // Test database connection through API
            if (!healthData.checks.database.success) {
                this.showError('Database connection failed');
                console.error('Database check failed:', healthData.checks.database);
                return;
            }

            console.log('All connections successful');

        } catch (error) {
            this.showError('Connection test failed');
            console.error('Connection test error:', error);
        }
    }

    showError(message) {
        showAlert(`ဆာဗာနှင့် ချိတ်ဆက်မှု မအောင်မြင်��ါ: ${message}`, 'danger');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    new ConnectionTester();
}); 