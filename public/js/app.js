// Main application logic
document.addEventListener('DOMContentLoaded', function() {
    // Your app initialization code will go here
    console.log('App initialized');
});

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const liveResults = document.getElementById('liveResults');
const mainContent = document.getElementById('mainContent');

// API Base URL
const API_BASE_URL = 'http://18kchat.42web.io/api/index.php';

// Helper function to call API
async function callApi(action, subaction = '', method = 'GET', data = null) {
    let url = `${API_BASE_URL}?action=${action}`;
    if (subaction) {
        url += `&subaction=${subaction}`;
    }

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    return response.json();
}

// Event Listeners
loginBtn.addEventListener('click', () => loginModal.show());
registerBtn.addEventListener('click', () => registerModal.show());

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    try {
        const response = await callApi('login', '', 'POST', {
            username: formData.get('username'),
            password: formData.get('password')
        });
        
        if (response.status === 'success') {
            localStorage.setItem('token', response.token);
            loginModal.hide();
            updateAuthUI(true);
            showAlert('Login successful!', 'success');
        } else {
            throw new Error(response.message || 'Login failed');
        }
    } catch (error) {
        showAlert(error.message || 'Login failed. Please try again.', 'danger');
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(registerForm);
    
    if (formData.get('password') !== formData.get('confirmPassword')) {
        showAlert('Passwords do not match!', 'danger');
        return;
    }
    
    try {
        const response = await callApi('register', '', 'POST', {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password')
        });
        
        if (response.status === 'success') {
            registerModal.hide();
            showAlert('Registration successful! Please login.', 'success');
        } else {
            throw new Error(response.message || 'Registration failed');
        }
    } catch (error) {
        showAlert(error.message || 'Registration failed. Please try again.', 'danger');
    }
});

// Navigation
document.querySelectorAll('[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        loadPage(e.target.dataset.page);
    });
});

// Functions
async function loadLiveResults() {
    try {
        const response = await callApi('results', 'live');
        if (response.status === 'success') {
            const resultsHTML = response.data.map(result => `
                <div class="col-md-3 col-sm-6">
                    <div class="result-box fade-in">
                        <h3>${result.lottery_type}</h3>
                        <div class="result-number">${result.result_number}</div>
                        <div class="result-time">${formatDateTime(result.draw_time)}</div>
                    </div>
                </div>
            `).join('');
            
            liveResults.innerHTML = resultsHTML;
        }
    } catch (error) {
        console.error('Error loading live results:', error);
    }
}

async function loadPage(page) {
    try {
        const response = await callApi('pages', page);
        if (response.status === 'success') {
            mainContent.innerHTML = response.data.content;
        } else {
            mainContent.innerHTML = '<div class="alert alert-danger">Error loading content</div>';
        }
    } catch (error) {
        console.error('Error loading page:', error);
        mainContent.innerHTML = '<div class="alert alert-danger">Error loading content</div>';
    }
}

function updateAuthUI(isLoggedIn) {
    const authButtons = document.getElementById('authButtons');
    if (isLoggedIn) {
        authButtons.innerHTML = `
            <span class="text-light me-3">Welcome back!</span>
            <button class="btn btn-light" onclick="logout()">Logout</button>
        `;
    } else {
        authButtons.innerHTML = `
            <button class="btn btn-light me-2" id="loginBtn">Login</button>
            <button class="btn btn-outline-light" id="registerBtn">Register</button>
        `;
    }
}

function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.querySelector('.container').insertBefore(alertDiv, document.querySelector('.container').firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

function formatDateTime(dateTime) {
    return new Date(dateTime).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function logout() {
    localStorage.removeItem('token');
    updateAuthUI(false);
    showAlert('Logged out successfully', 'info');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadLiveResults();
    setInterval(loadLiveResults, 60000); // Refresh every minute
    loadPage('home');
    updateAuthUI(!!localStorage.getItem('token'));
});
