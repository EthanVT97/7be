import { monitoring } from './monitoring.js';

class ErrorHandler {
    static handle(error) {
        console.log('Error/Message:', error);
        
        const alertContainer = document.getElementById('alertContainer');
        const alert = document.createElement('div');
        
        // Determine if this is an error or success message
        const type = error.type || 'danger';
        alert.className = `alert alert-${type} alert-dismissible fade show`;
        
        alert.innerHTML = `
            ${error.message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        alertContainer.appendChild(alert);
        setTimeout(() => alert.remove(), 5000);
    }
}

export default ErrorHandler;
