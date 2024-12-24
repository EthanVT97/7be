// Main application logic
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Global variables
const API_BASE_URL = 'http://localhost:8000/api';
let authToken = localStorage.getItem('authToken');
let refreshInterval;

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const liveResults = document.getElementById('liveResults');
const mainContent = document.getElementById('mainContent');
const loadingSpinner = document.createElement('div');
loadingSpinner.className = 'loading';

// Helper function to call API
async function callApi(endpoint, method = 'GET', data = null) {
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method,
            headers,
            body: data ? JSON.stringify(data) : null
        });

        if (!response.ok) {
            if (response.status === 401) {
                authToken = null;
                localStorage.removeItem('authToken');
                updateAuthUI(false);
                throw new Error('Authentication failed');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('API call failed:', error);
        showAlert(error.message, 'danger');
        throw error;
    }
}

// Event Listeners
if (loginBtn) loginBtn.addEventListener('click', () => loginModal.show());
if (registerBtn) registerBtn.addEventListener('click', () => registerModal.show());
if (logoutBtn) logoutBtn.addEventListener('click', logout);

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        try {
            const response = await callApi('/auth/login', 'POST', {
                username: formData.get('username'),
                password: formData.get('password')
            });
            
            if (response.token) {
                authToken = response.token;
                localStorage.setItem('authToken', authToken);
                loginModal.hide();
                updateAuthUI(true);
                showAlert('Login successful!', 'success');
                loadLiveResults();
            }
        } catch (error) {
            showAlert('Login failed: ' + error.message, 'danger');
        }
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(registerForm);
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        
        if (password !== confirmPassword) {
            showAlert('Passwords do not match!', 'danger');
            return;
        }
        
        try {
            const response = await callApi('/auth/register', 'POST', {
                username: formData.get('username'),
                password: password,
                email: formData.get('email')
            });
            
            registerModal.hide();
            showAlert('Registration successful! Please login.', 'success');
        } catch (error) {
            showAlert('Registration failed: ' + error.message, 'danger');
        }
    });
}

// Functions
async function loadLiveResults() {
    try {
        liveResults.appendChild(loadingSpinner);
        const results = await callApi('/lottery/results');
        
        const resultsHtml = results.map(result => `
            <div class="col-md-4">
                <div class="result-box">
                    <h3>${result.type} Draw</h3>
                    <div class="result-number">${result.number}</div>
                    <div class="result-time">${formatDateTime(result.draw_time)}</div>
                </div>
            </div>
        `).join('');
        
        liveResults.innerHTML = `
            <div class="row">
                ${resultsHtml}
            </div>
        `;
    } catch (error) {
        liveResults.innerHTML = '<div class="alert alert-danger">Failed to load results</div>';
    } finally {
        if (liveResults.contains(loadingSpinner)) {
            liveResults.removeChild(loadingSpinner);
        }
    }
}

function loadPage(page) {
    mainContent.appendChild(loadingSpinner);
    fetch(`pages/${page}.html`)
        .then(response => response.text())
        .then(html => {
            mainContent.innerHTML = html;
            if (page === 'home') {
                loadLiveResults();
            }
        })
        .catch(error => {
            mainContent.innerHTML = '<div class="alert alert-danger">Failed to load page</div>';
        })
        .finally(() => {
            if (mainContent.contains(loadingSpinner)) {
                mainContent.removeChild(loadingSpinner);
            }
        });
}

function updateAuthUI(isLoggedIn) {
    const authElements = document.querySelectorAll('.auth-required');
    const guestElements = document.querySelectorAll('.guest-only');
    
    authElements.forEach(element => {
        element.style.display = isLoggedIn ? '' : 'none';
    });
    
    guestElements.forEach(element => {
        element.style.display = isLoggedIn ? 'none' : '';
    });
    
    if (isLoggedIn) {
        startAutoRefresh();
    } else {
        stopAutoRefresh();
    }
}

function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const alertContainer = document.getElementById('alertContainer');
    if (alertContainer) {
        alertContainer.appendChild(alertDiv);
        setTimeout(() => alertDiv.remove(), 5000);
    }
}

function formatDateTime(dateTime) {
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateTime).toLocaleDateString('en-US', options);
}

function startAutoRefresh() {
    loadLiveResults();
    refreshInterval = setInterval(loadLiveResults, 60000); // Refresh every minute
}

function stopAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
}

function logout() {
    authToken = null;
    localStorage.removeItem('authToken');
    updateAuthUI(false);
    showAlert('Logged out successfully', 'info');
}

// Initialize the application
function initializeApp() {
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    if (token) {
        authToken = token;
        updateAuthUI(true);
    } else {
        updateAuthUI(false);
    }
    
    // Load initial page
    loadPage('home');
}
