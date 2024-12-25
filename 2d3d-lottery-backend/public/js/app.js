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
