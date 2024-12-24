// Import configuration
import config from './config.js';
import { api } from './services/api.js';
import { security } from './services/security.js';
import { monitoring } from './services/monitoring.js';

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Handle authentication state changes
document.addEventListener('authStateChanged', (event) => {
    updateAuthUI(event.detail.isAuthenticated);
    if (event.detail.isAuthenticated) {
        loadLiveResults();
        startAutoRefresh();
    } else {
        stopAutoRefresh();
    }
});

async function loadLiveResults() {
    try {
        const results = await api.call(config.ENDPOINTS.LOTTERY.LIVE);
        const liveResultsDiv = document.getElementById('liveResults');
        
        if (results.data && results.data.length > 0) {
            liveResultsDiv.innerHTML = results.data.map(result => `
                <div class="col-md-6 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${result.type} Result</h5>
                            <p class="card-text">Number: ${result.number}</p>
                            <p class="card-text">Time: ${formatDateTime(result.created_at)}</p>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            liveResultsDiv.innerHTML = '<p class="text-center">No results available</p>';
        }
    } catch (error) {
        showAlert('Error loading results: ' + error.message, 'danger');
    }
}

async function handleLogin(event) {
    event.preventDefault();
    
    const username = event.target.username.value;
    const password = event.target.password.value;

    // Check login attempts
    const loginCheck = security.checkLoginAttempts(username);
    if (!loginCheck.allowed) {
        showAlert(loginCheck.message, 'danger');
        return;
    }

    try {
        // Validate password
        const passwordCheck = security.validatePassword(password);
        if (!passwordCheck.valid) {
            showAlert(passwordCheck.message, 'danger');
            return;
        }

        // Authenticate with Firebase
        const auth = window.firebaseAuth;
        const userCredential = await auth.signInWithEmailAndPassword(username, password);
        const token = await userCredential.user.getIdToken();

        // Authenticate with backend
        const response = await api.call(config.ENDPOINTS.AUTH.LOGIN, 'POST', {
            username,
            token
        });

        security.recordLoginAttempt(username, true);
        bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
        showAlert('Login successful!', 'success');

    } catch (error) {
        security.recordLoginAttempt(username, false);
        showAlert('Login failed: ' + error.message, 'danger');
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;

    try {
        // Validate password
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        const passwordCheck = security.validatePassword(password);
        if (!passwordCheck.valid) {
            throw new Error(passwordCheck.message);
        }

        // Register with Firebase
        const auth = window.firebaseAuth;
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const token = await userCredential.user.getIdToken();

        // Register with backend
        await api.call(config.ENDPOINTS.AUTH.REGISTER, 'POST', {
            username,
            email,
            token
        });

        bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
        showAlert('Registration successful! Please log in.', 'success');

    } catch (error) {
        showAlert('Registration failed: ' + error.message, 'danger');
    }
}

async function handleLogout() {
    try {
        await api.call(config.ENDPOINTS.AUTH.LOGOUT, 'POST');
        await window.firebaseAuth.signOut();
        showAlert('Logged out successfully', 'success');
    } catch (error) {
        showAlert('Logout failed: ' + error.message, 'danger');
    }
}

function updateAuthUI(isAuthenticated) {
    const authRequired = document.querySelectorAll('.auth-required');
    const guestOnly = document.querySelectorAll('.guest-only');
    
    authRequired.forEach(el => el.style.display = isAuthenticated ? '' : 'none');
    guestOnly.forEach(el => el.style.display = isAuthenticated ? 'none' : '');
}

function showAlert(message, type = 'info') {
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

function formatDateTime(dateTime) {
    return new Date(dateTime).toLocaleString();
}

function startAutoRefresh() {
    stopAutoRefresh();
    refreshInterval = setInterval(loadLiveResults, config.REFRESH_INTERVAL);
}

function stopAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
}

function initializeApp() {
    // Add event listeners
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    // Initialize security service
    security.setupTokenRefresh();

    // Load initial data if token exists
    const token = localStorage.getItem('authToken');
    if (token) {
        loadLiveResults();
        startAutoRefresh();
    }
}
