import { ApiService } from '../services/api.service.js';

export class AuthGuard {
    static checkAuth() {
        if (!ApiService.isAuthenticated()) {
            window.location.href = '/login.html';
            return false;
        }
        return true;
    }

    static checkRole(allowedRoles) {
        const user = ApiService.getCurrentUser();
        if (!user || !allowedRoles.includes(user.role)) {
            window.location.href = '/unauthorized.html';
            return false;
        }
        return true;
    }
} 