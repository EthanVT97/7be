export class SettingsView {
    constructor(adminService) {
        this.adminService = adminService;
        this.contentArea = document.getElementById('contentArea');
    }

    async render() {
        const settings = await this.adminService.getSettings();
        
        this.contentArea.innerHTML = `
            <div class="row">
                <!-- 2D Settings -->
                <div class="col-md-6 mb-4">
                    <div class="admin-form">
                        <h4 class="mb-4">၂ လုံး ထီ ဆက်တင်များ</h4>
                        
                        <form id="2dSettingsForm">
                            <!-- Betting Limits -->
                            <div class="form-group">
                                <label>အနိမ့်ဆုံး ထိုးငွေ</label>
                                <input type="number" class="form-control" name="minAmount" 
                                    value="${settings.twoD.minAmount}" required>
                            </div>
                            
                            <div class="form-group">
                                <label>အမြင့်ဆုံး ထိုးငွေ</label>
                                <input type="number" class="form-control" name="maxAmount" 
                                    value="${settings.twoD.maxAmount}" required>
                            </div>

                            <!-- Payout Rate -->
                            <div class="form-group">
                                <label>ထီပေါက်ဆု နှုန်း</label>
                                <input type="number" class="form-control" name="payoutRate" 
                                    value="${settings.twoD.payoutRate}" required>
                            </div>

                            <!-- Blocked Numbers -->
                            <div class="form-group">
                                <label>ပိတ်ထားသော ဂဏန်းများ</label>
                                <div class="blocked-numbers-grid mb-2">
                                    ${this.renderNumberGrid(2, settings.twoD.blockedNumbers)}
                                </div>
                            </div>

                            <!-- Number Limits -->
                            <div class="form-group">
                                <label>ဂဏန်းအလိုက် ကန့်သတ်ငွေ</label>
                                <div class="number-limits mb-2">
                                    ${this.renderNumberLimits(settings.twoD.numberLimits)}
                                </div>
                                <button type="button" class="btn btn-outline-primary btn-sm" 
                                    onclick="addNumberLimit('2d')">
                                    + ဂဏန်းကန့်သတ်ချက် ထပ်ထည့်ရန်
                                </button>
                            </div>

                            <button type="submit" class="btn btn-primary">
                                သိမ်းဆည်းမည်
                            </button>
                        </form>
                    </div>
                </div>

                <!-- 3D Settings -->
                <div class="col-md-6 mb-4">
                    <div class="admin-form">
                        <h4 class="mb-4">၃ လုံး ထီ ဆက်တင်များ</h4>
                        
                        <form id="3dSettingsForm">
                            <!-- Betting Limits -->
                            <div class="form-group">
                                <label>အ��ိမ့်ဆုံး ထိုးငွေ</label>
                                <input type="number" class="form-control" name="minAmount" 
                                    value="${settings.threeD.minAmount}" required>
                            </div>
                            
                            <div class="form-group">
                                <label>အမြင့်ဆုံး ထိုးငွေ</label>
                                <input type="number" class="form-control" name="maxAmount" 
                                    value="${settings.threeD.maxAmount}" required>
                            </div>

                            <!-- Payout Rate -->
                            <div class="form-group">
                                <label>ထီပေါက်ဆု နှုန်း</label>
                                <input type="number" class="form-control" name="payoutRate" 
                                    value="${settings.threeD.payoutRate}" required>
                            </div>

                            <!-- Blocked Numbers -->
                            <div class="form-group">
                                <label>ပိတ်ထားသော ဂဏန်းများ</label>
                                <div class="blocked-numbers-grid mb-2">
                                    ${this.renderNumberGrid(3, settings.threeD.blockedNumbers)}
                                </div>
                            </div>

                            <!-- Number Limits -->
                            <div class="form-group">
                                <label>ဂဏန်းအလိုက် ကန့်သတ်ငွေ</label>
                                <div class="number-limits mb-2">
                                    ${this.renderNumberLimits(settings.threeD.numberLimits)}
                                </div>
                                <button type="button" class="btn btn-outline-primary btn-sm" 
                                    onclick="addNumberLimit('3d')">
                                    + ဂဏန်းကန့်သတ်ချက် ထပ်ထည့်ရန်
                                </button>
                            </div>

                            <button type="submit" class="btn btn-primary">
                                သိမ်းဆည်းမည်
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    renderNumberGrid(digits, blockedNumbers) {
        const total = Math.pow(10, digits);
        let html = '<div class="number-grid">';
        
        for(let i = 0; i < total; i++) {
            const num = i.toString().padStart(digits, '0');
            const isBlocked = blockedNumbers.includes(num);
            
            html += `
                <div class="number-item ${isBlocked ? 'blocked' : ''}" 
                    data-number="${num}" onclick="toggleBlockedNumber('${num}')">
                    ${num}
                </div>
            `;
        }
        
        html += '</div>';
        return html;
    }

    renderNumberLimits(limits) {
        return limits.map((limit, index) => `
            <div class="number-limit-item mb-2">
                <div class="input-group">
                    <input type="text" class="form-control" 
                        placeholder="ဂဏန်း" value="${limit.number}"
                        name="limitNumber_${index}">
                    <input type="number" class="form-control" 
                        placeholder="ကန့်သတ်ငွေ" value="${limit.amount}"
                        name="limitAmount_${index}">
                    <button type="button" class="btn btn-danger" 
                        onclick="removeNumberLimit(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    bindEvents() {
        // 2D Settings Form
        document.getElementById('2dSettingsForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const settings = {
                minAmount: parseInt(formData.get('minAmount')),
                maxAmount: parseInt(formData.get('maxAmount')),
                payoutRate: parseFloat(formData.get('payoutRate')),
                blockedNumbers: this.getBlockedNumbers(2),
                numberLimits: this.getNumberLimits('2d')
            };

            try {
                await this.adminService.updateSettings({ twoD: settings });
                showAlert('2D ဆက်တင်များ အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ', 'success');
            } catch (error) {
                showAlert(error.message, 'danger');
            }
        });

        // 3D Settings Form
        document.getElementById('3dSettingsForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const settings = {
                minAmount: parseInt(formData.get('minAmount')),
                maxAmount: parseInt(formData.get('maxAmount')),
                payoutRate: parseFloat(formData.get('payoutRate')),
                blockedNumbers: this.getBlockedNumbers(3),
                numberLimits: this.getNumberLimits('3d')
            };

            try {
                await this.adminService.updateSettings({ threeD: settings });
                showAlert('3D ဆက်တင်များ အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ', 'success');
            } catch (error) {
                showAlert(error.message, 'danger');
            }
        });
    }

    getBlockedNumbers(digits) {
        const blockedNumbers = [];
        document.querySelectorAll(`.number-grid .number-item.blocked`).forEach(item => {
            if (item.dataset.number.length === digits) {
                blockedNumbers.push(item.dataset.number);
            }
        });
        return blockedNumbers;
    }

    getNumberLimits(type) {
        const limits = [];
        document.querySelectorAll(`#${type}SettingsForm .number-limit-item`).forEach((item, index) => {
            const number = item.querySelector(`[name="limitNumber_${index}"]`).value;
            const amount = parseInt(item.querySelector(`[name="limitAmount_${index}"]`).value);
            if (number && amount) {
                limits.push({ number, amount });
            }
        });
        return limits;
    }

    destroy() {
        // Cleanup if needed
    }
} 