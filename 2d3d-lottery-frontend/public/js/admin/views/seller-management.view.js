export class SellerManagementView {
    constructor(adminService) {
        this.adminService = adminService;
        this.contentArea = document.getElementById('contentArea');
    }

    async render() {
        const sellers = await this.adminService.getSellers();
        const pendingRequests = await this.adminService.getSellerRequests();
        
        this.contentArea.innerHTML = `
            <div class="row">
                <!-- Seller Registration -->
                <div class="col-md-6 mb-4">
                    <div class="admin-form">
                        <h4 class="mb-4">ရောင်းသား အကောင့်အသစ် ဖွင့်ရန်</h4>
                        
                        <form id="sellerRegistrationForm">
                            <div class="form-group">
                                <label>အမည်</label>
                                <input type="text" class="form-control" name="name" required>
                            </div>

                            <div class="form-group">
                                <label>ဖုန်းနံပါတ်</label>
                                <input type="tel" class="form-control" name="phone" required>
                            </div>

                            <div class="form-group">
                                <label>လျှို့ဝှက်နံပါတ်</label>
                                <input type="password" class="form-control" name="password" required>
                            </div>

                            <div class="form-group">
                                <label>ကော်မရှင်နှုန်း (%)</label>
                                <input type="number" class="form-control" name="commission" 
                                    min="0" max="100" step="0.1" required>
                            </div>

                            <div class="form-group">
                                <label>ငွေထုတ်ယူနိုင်သည့်ရက်</label>
                                <select class="form-control" name="payoutDays" multiple>
                                    <option value="1">လစဉ် ၁ ရက်</option>
                                    <option value="15">လစဉ် ၁၅ ရက်</option>
                                    <option value="30">လကုန်ရက်</option>
                                </select>
                            </div>

                            <button type="submit" class="btn btn-primary">
                                အကောင့်ဖွင့်ပေးမည်
                            </button>
                        </form>
                    </div>
                </div>

                <!-- Pending Requests -->
                <div class="col-md-6 mb-4">
                    <div class="admin-form">
                        <h4 class="mb-4">ရောင်းသား အကောင့်တောင်းဆိုမှုများ</h4>
                        
                        <div class="table-container">
                            <table class="admin-table">
                                <thead>
                                    <tr>
                                        <th>အမည်</th>
                                        <th>ဖုန်း</th>
                                        <th>တောင်းဆိုသည့်ရက်</th>
                                        <th>လုပ်ဆောင်ချက်</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${this.renderPendingRequests(pendingRequests)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Seller List & Sales Report -->
            <div class="row mt-4">
                <div class="col-12">
                    <div class="admin-form">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h4>ရောင်းသားများ စာရင်း</h4>
                            
                            <!-- Date Range Filter -->
                            <div class="d-flex gap-3">
                                <input type="date" class="form-control" id="startDate">
                                <input type="date" class="form-control" id="endDate">
                                <button class="btn btn-primary" onclick="filterSales()">
                                    <i class="fas fa-filter"></i> စစ်ထုတ်ကြည့်ရှုရန်
                                </button>
                            </div>
                        </div>

                        <div class="table-container">
                            <table class="admin-table">
                                <thead>
                                    <tr>
                                        <th>အမည်</th>
                                        <th>ဖုန်း</th>
                                        <th>ရောင်းအား</th>
                                        <th>ကော်မရှင်</th>
                                        <th>အသေးစိတ်</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${this.renderSellerList(sellers)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Seller Details Modal -->
            <div class="modal fade" id="sellerDetailsModal">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">ရောင်းသား အသေးစိတ်အချက်အလက်</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body" id="sellerDetailsContent">
                            <!-- Dynamic content will be loaded here -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    renderPendingRequests(requests) {
        return requests.map(req => `
            <tr>
                <td>${req.name}</td>
                <td>${req.phone}</td>
                <td>${new Date(req.requestDate).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-sm btn-success me-2" onclick="approveRequest('${req.id}')">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="rejectRequest('${req.id}')">
                        <i class="fas fa-times"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    renderSellerList(sellers) {
        return sellers.map(seller => `
            <tr>
                <td>${seller.name}</td>
                <td>${seller.phone}</td>
                <td>${seller.totalSales.toLocaleString()}Ks</td>
                <td>${seller.commission.toLocaleString()}Ks</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="showSellerDetails('${seller.id}')">
                        <i class="fas fa-eye"></i> အသေးစိတ်ကြည့်ရန်
                    </button>
                </td>
            </tr>
        `).join('');
    }

    async showSellerDetails(sellerId) {
        const details = await this.adminService.getSellerDetails(sellerId);
        const modal = document.getElementById('sellerDetailsContent');

        modal.innerHTML = `
            <div class="seller-details">
                <!-- Sales Summary -->
                <div class="sales-summary mb-4">
                    <h6>ရောင်းအား အကျဉ်းချုပ်</h6>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="stat-card">
                                <div class="stat-title">စုစုပေါင်း ရောင်းအား</div>
                                <div class="stat-value">${details.totalSales.toLocaleString()}Ks</div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="stat-card">
                                <div class="stat-title">ကော်မရှင်</div>
                                <div class="stat-value">${details.commission.toLocaleString()}Ks</div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="stat-card">
                                <div class="stat-title">ထီထိုးသူ အရေအတွက်</div>
                                <div class="stat-value">${details.customerCount}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sales by Number -->
                <div class="sales-by-number mb-4">
                    <h6>ဂဏန်းအလိုက် ရောင်းအား</h6>
                    <div class="table-container">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>ဂဏန်း</th>
                                    <th>ရောင်းအား</th>
                                    <th>ထီထိုးသူ</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.renderSalesByNumber(details.salesByNumber)}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Recent Transactions -->
                <div class="recent-transactions">
                    <h6>နောက်ဆုံး ရောင်းချမှုများ</h6>
                    <div class="table-container">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>ရက်စွဲ</th>
                                    <th>ဂဏန်း</th>
                                    <th>ငွေပမာဏ</th>
                                    <th>ထီထိုးသူ</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.renderRecentTransactions(details.recentTransactions)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('sellerDetailsModal'));
        modal.show();
    }

    renderSalesByNumber(sales) {
        return sales.map(sale => `
            <tr>
                <td>${sale.number}</td>
                <td>${sale.amount.toLocaleString()}Ks</td>
                <td>${sale.customerCount}</td>
            </tr>
        `).join('');
    }

    renderRecentTransactions(transactions) {
        return transactions.map(tx => `
            <tr>
                <td>${new Date(tx.date).toLocaleString()}</td>
                <td>${tx.number}</td>
                <td>${tx.amount.toLocaleString()}Ks</td>
                <td>${tx.customerName}</td>
            </tr>
        `).join('');
    }

    bindEvents() {
        // Seller Registration Form
        document.getElementById('sellerRegistrationForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            
            try {
                await this.adminService.createSeller({
                    name: formData.get('name'),
                    phone: formData.get('phone'),
                    password: formData.get('password'),
                    commission: parseFloat(formData.get('commission')),
                    payoutDays: Array.from(e.target.payoutDays.selectedOptions).map(opt => parseInt(opt.value))
                });
                
                showAlert('ရောင်းသား အကောင့် အောင်မြင်စွာ ဖွင့်ပြီးပါပြီ', 'success');
                this.render(); // Refresh view
            } catch (error) {
                showAlert(error.message, 'danger');
            }
        });

        // Date Range Filter
        document.getElementById('startDate').addEventListener('change', this.filterSales.bind(this));
        document.getElementById('endDate').addEventListener('change', this.filterSales.bind(this));
    }

    async filterSales() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        if (startDate && endDate) {
            const sellers = await this.adminService.getSellersByDateRange(startDate, endDate);
            const tbody = document.querySelector('.admin-table tbody');
            tbody.innerHTML = this.renderSellerList(sellers);
        }
    }

    destroy() {
        // Cleanup event listeners
    }
} 