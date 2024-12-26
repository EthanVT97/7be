import { AdminService } from '../services/admin.service.js';
import { DashboardView } from './views/dashboard.view.js';
import { UsersView } from './views/users.view.js';
import { TransactionsView } from './views/transactions.view.js';
import { SettingsView } from './views/settings.view.js';
import { ReportsView } from './views/reports.view.js';

class AdminPanel {
    constructor() {
        this.adminService = new AdminService();
        this.currentView = null;
        this.views = {
            dashboard: new DashboardView(this.adminService),
            users: new UsersView(this.adminService),
            transactions: new TransactionsView(this.adminService),
            settings: new SettingsView(this.adminService),
            reports: new ReportsView(this.adminService)
        };

        this.init();
    }

    async init() {
        this.checkAuth();
        this.bindEvents();
        this.handleRoute();
    }

    async checkAuth() {
        try {
            const isAdmin = await this.adminService.checkAdminAuth();
            if (!isAdmin) {
                window.location.href = '/login.html';
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            window.location.href = '/login.html';
        }
    }

    bindEvents() {
        // Navigation handling
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const route = e.target.getAttribute('href').substring(1);
                this.navigate(route);
            });
        });
    }

    async navigate(route) {
        // Update active link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${route}`) {
                link.classList.add('active');
            }
        });

        // Update page title
        document.getElementById('pageTitle').textContent = 
            this.getPageTitle(route);

        // Clear current view
        if (this.currentView) {
            this.currentView.destroy();
        }

        // Load new view
        this.currentView = this.views[route];
        await this.currentView.render();
    }

    getPageTitle(route) {
        const titles = {
            dashboard: 'Dashboard',
            users: 'အသုံးပြုသူများ',
            transactions: 'ငွေသွင်း/ထုတ်',
            settings: 'ဆက်တင်များ',
            reports: 'အစီရင်ခံစာများ'
        };
        return titles[route] || 'Dashboard';
    }

    handleRoute() {
        const route = window.location.hash.substring(1) || 'dashboard';
        this.navigate(route);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    new AdminPanel();
}); 