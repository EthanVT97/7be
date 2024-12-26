import { ApiService } from '../../services/api.service.js';
import { AuthGuard } from '../../guards/auth.guard.js';
import { ErrorHandler } from '../../utils/error-handler.js';
import { LoadingSpinner } from '../../components/loading.js';

export class RolesView {
    constructor() {
        this.container = document.getElementById('mainContent');
        this.loading = new LoadingSpinner(this.container);
        this.errorDiv = document.createElement('div');
        this.errorDiv.className = 'error-message';
        this.container.appendChild(this.errorDiv);

        // Check admin access
        if (!AuthGuard.checkRole(['admin'])) return;

        this.initialize();
    }

    async initialize() {
        try {
            this.loading.show();
            
            // Get users with roles
            const users = await ApiService.getUsers();
            
            this.renderRoles(users);

        } catch (error) {
            ErrorHandler.handle(error, this.errorDiv);
        } finally {
            this.loading.hide();
        }
    }

    renderRoles(users) {
        const template = `
            <div class="roles-container">
                <h2>User Roles</h2>
                <table class="roles-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.map(user => this.getUserRow(user)).join('')}
                    </tbody>
                </table>
            </div>
        `;

        this.container.innerHTML = template;
        this.attachEventListeners();
    }

    getUserRow(user) {
        return `
            <tr data-id="${user.id}">
                <td>${user.name}</td>
                <td>${user.phone}</td>
                <td>
                    <select class="role-select" ${user.role === 'admin' ? 'disabled' : ''}>
                        <option value="agent" ${user.role === 'agent' ? 'selected' : ''}>Agent</option>
                        <option value="seller" ${user.role === 'seller' ? 'selected' : ''}>Seller</option>
                    </select>
                </td>
                <td>
                    <select class="status-select">
                        <option value="active" ${user.status === 'active' ? 'selected' : ''}>Active</option>
                        <option value="inactive" ${user.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                        <option value="banned" ${user.status === 'banned' ? 'selected' : ''}>Banned</option>
                    </select>
                </td>
                <td>
                    <button class="save-btn">Save</button>
                </td>
            </tr>
        `;
    }

    attachEventListeners() {
        const saveBtns = document.querySelectorAll('.save-btn');
        saveBtns.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const row = e.target.closest('tr');
                const userId = row.dataset.id;
                const role = row.querySelector('.role-select').value;
                const status = row.querySelector('.status-select').value;

                try {
                    this.loading.show();
                    await ApiService.updateUser(userId, { role, status });
                    this.errorDiv.textContent = 'Successfully updated';
                } catch (error) {
                    ErrorHandler.handle(error, this.errorDiv);
                } finally {
                    this.loading.hide();
                }
            });
        });
    }
}

// Initialize roles view
new RolesView(); 