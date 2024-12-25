import { ApiService } from './services/api.service.js';
import { AuthGuard } from './guards/auth.guard.js';

class Layout {
    constructor() {
        this.initializeLayout();
        this.setupEventListeners();
    }

    initializeLayout() {
        // Check authentication
        if (!AuthGuard.checkAuth()) return;

        const user = ApiService.getCurrentUser();
        document.getElementById('userName').textContent = user.name;

        // Setup menu based on role
        this.setupMenu(user.role);
    }

    setupMenu(role) {
        const menuItems = this.getMenuItems(role);
        const menuContainer = document.getElementById('menu');
        
        menuItems.forEach(item => {
            const link = document.createElement('a');
            link.href = item.url;
            link.textContent = item.text;
            menuContainer.appendChild(link);
        });
    }

    getMenuItems(role) {
        const menuItems = {
            admin: [
                { url: '/admin/dashboard.html', text: 'Dashboard' },
                { url: '/admin/users.html', text: 'Users' },
                { url: '/admin/sales.html', text: 'Sales' }
            ],
            agent: [
                { url: '/agent/dashboard.html', text: 'Dashboard' },
                { url: '/agent/sellers.html', text: 'Sellers' }
            ],
            seller: [
                { url: '/seller/dashboard.html', text: 'Dashboard' },
                { url: '/seller/sales.html', text: 'Sales' }
            ]
        };

        return menuItems[role] || [];
    }

    setupEventListeners() {
        document.getElementById('logoutBtn').addEventListener('click', () => {
            ApiService.logout();
        });
    }
}

// Initialize layout
new Layout(); 