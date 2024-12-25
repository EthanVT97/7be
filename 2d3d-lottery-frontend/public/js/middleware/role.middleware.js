export class RoleMiddleware {
    constructor(roles = []) {
        this.allowedRoles = roles;
    }

    checkAccess() {
        const userRole = localStorage.getItem('user_role');
        
        if (!userRole || !this.allowedRoles.includes(userRole)) {
            window.location.href = '/unauthorized.html';
            return false;
        }
        
        return true;
    }
} 