export class AdminService {
    constructor() {
        this.baseUrl = process.env.API_BASE_URL || 'http://localhost:8000/api/admin';
        this.token = localStorage.getItem('admin_token');
    }

    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
    }

    async fetchApi(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers: this.getHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            return data;
        } catch (error) {
            console.error('Admin API Error:', error);
            throw error;
        }
    }

    // Users
    async getUsers(page = 1, limit = 10) {
        return this.fetchApi(`/users?page=${page}&limit=${limit}`);
    }

    async updateUser(userId, data) {
        return this.fetchApi(`/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteUser(userId) {
        return this.fetchApi(`/users/${userId}`, {
            method: 'DELETE'
        });
    }

    // Transactions
    async getPendingTransactions() {
        return this.fetchApi('/transactions/pending');
    }

    async approveTransaction(transactionId) {
        return this.fetchApi(`/transactions/${transactionId}/approve`, {
            method: 'POST'
        });
    }

    async rejectTransaction(transactionId, reason) {
        return this.fetchApi(`/transactions/${transactionId}/reject`, {
            method: 'POST',
            body: JSON.stringify({ reason })
        });
    }

    // Settings
    async getSettings() {
        return this.fetchApi('/settings');
    }

    async updateSettings(settings) {
        return this.fetchApi('/settings', {
            method: 'PUT',
            body: JSON.stringify(settings)
        });
    }

    // Reports
    async getDailyReport(date) {
        return this.fetchApi(`/reports/daily?date=${date}`);
    }

    async getMonthlyReport(month, year) {
        return this.fetchApi(`/reports/monthly?month=${month}&year=${year}`);
    }

    // Auth
    async checkAdminAuth() {
        try {
            const response = await this.fetchApi('/auth/check');
            return response.success;
        } catch {
            return false;
        }
    }

    // Role Management
    async getRoles() {
        return this.fetchApi('/roles');
    }

    async createRole(roleData) {
        return this.fetchApi('/roles', {
            method: 'POST',
            body: JSON.stringify(roleData)
        });
    }

    async updateRole(roleId, roleData) {
        return this.fetchApi(`/roles/${roleId}`, {
            method: 'PUT',
            body: JSON.stringify(roleData)
        });
    }

    async deleteRole(roleId) {
        return this.fetchApi(`/roles/${roleId}`, {
            method: 'DELETE'
        });
    }

    // User Role Management
    async getUsersByRole(role = '') {
        return this.fetchApi(`/users/by-role${role ? `?role=${role}` : ''}`);
    }

    async updateUserRole(userId, roleId) {
        return this.fetchApi(`/users/${userId}/role`, {
            method: 'PUT',
            body: JSON.stringify({ roleId })
        });
    }

    // Commission Management
    async getCommissionSettings() {
        return this.fetchApi('/settings/commission');
    }

    async updateCommissionSettings(settings) {
        return this.fetchApi('/settings/commission', {
            method: 'PUT',
            body: JSON.stringify(settings)
        });
    }

    // Commission Reports
    async getCommissionReport(startDate, endDate, role = '') {
        return this.fetchApi(`/reports/commission?start=${startDate}&end=${endDate}${role ? `&role=${role}` : ''}`);
    }

    // Seller Management
    async getSellers() {
        return this.fetchApi('/sellers');
    }

    async getSellerRequests() {
        return this.fetchApi('/sellers/requests');
    }

    async createSeller(sellerData) {
        return this.fetchApi('/sellers', {
            method: 'POST',
            body: JSON.stringify(sellerData)
        });
    }

    async approveSellerRequest(requestId) {
        return this.fetchApi(`/sellers/requests/${requestId}/approve`, {
            method: 'POST'
        });
    }

    async rejectSellerRequest(requestId) {
        return this.fetchApi(`/sellers/requests/${requestId}/reject`, {
            method: 'POST'
        });
    }

    async getSellerDetails(sellerId) {
        return this.fetchApi(`/sellers/${sellerId}/details`);
    }

    async getSellersByDateRange(startDate, endDate) {
        return this.fetchApi(`/sellers/sales?start=${startDate}&end=${endDate}`);
    }
} 