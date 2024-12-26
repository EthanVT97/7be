<<<<<<< HEAD
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
=======
import config from './config.js';
import { api } from './services/api.js';
import { security } from './services/security.js';
import { monitoring } from './services/monitoring.js';
import ErrorHandler from './services/errorHandler.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    try {
        // Setup event listeners
        setupEventListeners();
        
        // Check authentication status
        await security.checkAuthStatus();
        
        // Load initial page
        await loadPage('home');
        
        // Hide loading spinner
        document.getElementById('loadingSpinner').style.display = 'none';
    } catch (error) {
        ErrorHandler.handle(error);
    }
}

function setupEventListeners() {
    // Auth buttons
    document.getElementById('loginBtn')?.addEventListener('click', () => security.showLoginModal());
    document.getElementById('registerBtn')?.addEventListener('click', () => security.showRegisterModal());
    document.getElementById('logoutBtn')?.addEventListener('click', () => security.logout());
    
    // Language selector
    const languageButtons = document.querySelectorAll('[onclick^="setLanguage"]');
    languageButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = button.getAttribute('onclick').split("'")[1];
            setLanguage(lang);
        });
    });
}

async function loadPage(pageName) {
    try {
        const response = await fetch(`/pages/${pageName}.html`);
        if (!response.ok) throw new Error('Page not found');
        
        const content = await response.text();
        document.getElementById('mainContent').innerHTML = content;
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('onclick')?.includes(pageName)) {
                link.classList.add('active');
            }
        });
    } catch (error) {
        ErrorHandler.handle(error);
    }
}

function setLanguage(lang) {
    try {
        localStorage.setItem('preferred_language', lang);
        document.documentElement.lang = lang;
        // Refresh content with new language
        const currentPage = document.querySelector('.nav-link.active')?.getAttribute('onclick')?.split("'")[1] || 'home';
        loadPage(currentPage);
    } catch (error) {
        ErrorHandler.handle(error);
    }
}

// Make functions available globally
window.loadPage = loadPage;
window.setLanguage = setLanguage;
>>>>>>> aa145722f6a011a22d3e9f2b280787ab3c45a8fc
