import { ConnectionTest } from './utils/connection-test.js';

// Check connections on app start
async function checkConnections() {
    const backendStatus = await ConnectionTest.checkConnection();
    const dbStatus = await ConnectionTest.testDatabaseConnection();

    if (backendStatus.status === 'disconnected') {
        showError('Backend server is not responding');
        return false;
    }

    if (dbStatus.status === 'disconnected') {
        showError('Database connection failed');
        return false;
    }

    console.log('All connections successful');
    return true;
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger';
    errorDiv.textContent = message;
    document.body.insertBefore(errorDiv, document.body.firstChild);
}

// Run connection test
document.addEventListener('DOMContentLoaded', checkConnections); 