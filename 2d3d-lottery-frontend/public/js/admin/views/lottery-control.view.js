export class LotteryControlView {
    constructor(adminService) {
        this.adminService = adminService;
        this.contentArea = document.getElementById('contentArea');
    }

    async render() {
        const settings = await this.adminService.getLotteryControlSettings();
        
        this.contentArea.innerHTML = `
            <div class="row">
                <!-- 2D Control -->
                <div class="col-md-6 mb-4">
                    <div class="admin-form">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h4>၂ လုံး ထီ ထိန်းချုပ်မှု</h4>
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="toggle2D"
                                    ${settings.twoD.isEnabled ? 'checked' : ''}>
                                <label class="form-check-label" for="toggle2D">
                                    ${settings.twoD.isEnabled ? 'ဖွင့်ထား' : 'ပိတ်ထား'}
                                </label>
                            </div>
                        </div>

                        <form id="2dControlForm">
                            <!-- Time Settings -->
                            <div class="form-group">
                                <label>ထီပိတ်ချိန်</label>
                                <input type="time" class="form-control" name="closeTime" 
                                    value="${settings.twoD.closeTime}" required>
                            </div>

                            <!-- Number Controls -->
                            <div class="form-group mt-4">
                                <label>ယနေ့ပိတ်မည့် ဂဏန်းများ</label>
                                <div class="number-grid mb-3" id="2dNumberGrid">
                                    ${this.renderNumberGrid(2)}
                                </div>
                                <div class="selected-numbers mb-3">
                                    <strong>ရွေးချယ်ထားသော ဂဏန်းများ:</strong>
                                    <div id="selected2DNumbers" class="mt-2">
                                        ${this.renderSelectedNumbers(settings.twoD.blockedNumbers)}
                                    </div>
                                </div>
                            </div>

                            <!-- Amount Limits -->
                            <div class="form-group">
                                <label>ဂဏန်းအလိုက် ငွေပမာဏ ကန့်သတ်ချက်များ</label>
                                <div id="2dLimits">
                                    ${this.renderAmountLimits(settings.twoD.numberLimits)}
                                </div>
                                <button type="button" class="btn btn-outline-primary btn-sm mt-2" 
                                    onclick="addNewLimit('2d')">
                                    + ကန့်သတ်ချက် ထပ်ထည့်ရန်
                                </button>
                            </div>

                            <!-- Hot Numbers -->
                            <div class="form-group mt-4">
                                <label>လူကြိုက်များသော ဂဏန်းများ</label>
                                <div class="hot-numbers mb-3">
                                    ${this.renderHotNumbers(settings.twoD.hotNumbers)}
                                </div>
                            </div>

                            <button type="submit" class="btn btn-primary mt-4">
                                သိမ်းဆည်းမည်
                            </button>
                        </form>
                    </div>
                </div>

                <!-- 3D Control -->
                <div class="col-md-6 mb-4">
                    <div class="admin-form">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h4>၃ လုံး ထီ ထိန်းချုပ်မှု</h4>
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="toggle3D"
                                    ${settings.threeD.isEnabled ? 'checked' : ''}>
                                <label class="form-check-label" for="toggle3D">
                                    ${settings.threeD.isEnabled ? 'ဖွင့်ထား' : 'ပိတ်ထား'}
                                </label>
                            </div>
                        </div>

                        <form id="3dControlForm">
                            <!-- Similar structure as 2D but for 3D -->
                            ...
                        </form>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="row mt-4">
                <div class="col-12">
                    <div class="admin-form">
                        <h4 class="mb-4">အမြန် လုပ်ဆောင်ချက်များ</h4>
                        
                        <div class="d-flex gap-3">
                            <button class="btn btn-warning" onclick="blockHotNumbers()">
                                <i class="fas fa-fire"></i> လူကြိုက်များသော ဂဏန်းများ ပိတ်ရန်
                            </button>
                            <button class="btn btn-danger" onclick="emergencyShutdown()">
                                <i class="fas fa-exclamation-triangle"></i> အရေးပေါ် ပိတ်ရန်
                            </button>
                            <button class="btn btn-success" onclick="resetAllLimits()">
                                <i class="fas fa-redo"></i> ကန့်သတ်ချက်များ ပြန်လည်သတ်မှတ်ရန်
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    renderNumberGrid(digits) {
        const total = digits === 2 ? 100 : 1000;
        let html = '<div class="number-grid">';
        
        for (let i = 0; i < total; i++) {
            const num = i.toString().padStart(digits, '0');
            html += `
                <div class="number-item" data-number="${num}">
                    ${num}
                </div>
            `;
        }
        
        html += '</div>';
        return html;
    }

    renderSelectedNumbers(numbers) {
        return numbers.map(num => `
            <span class="badge bg-primary me-2 mb-2">
                ${num}
                <i class="fas fa-times ms-1" onclick="removeNumber('${num}')"></i>
            </span>
        `).join('');
    }

    renderAmountLimits(limits) {
        return limits.map((limit, index) => `
            <div class="number-limit-item mb-2">
                <div class="input-group">
                    <input type="text" class="form-control" placeholder="ဂဏန်း" 
                        value="${limit.number}" name="limitNumber_${index}">
                    <input type="number" class="form-control" placeholder="ကန့်သတ်ငွေ" 
                        value="${limit.amount}" name="limitAmount_${index}">
                    <button type="button" class="btn btn-danger" onclick="removeLimit(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderHotNumbers(numbers) {
        return numbers.map(num => `
            <div class="hot-number-item">
                <span class="number">${num.number}</span>
                <span class="amount">${num.amount.toLocaleString()}Ks</span>
                <div class="progress">
                    <div class="progress-bar bg-danger" style="width: ${num.percentage}%"></div>
                </div>
            </div>
        `).join('');
    }

    bindEvents() {
        // Toggle 2D/3D
        document.getElementById('toggle2D').addEventListener('change', async (e) => {
            try {
                await this.adminService.updateLotteryStatus('2d', e.target.checked);
                showAlert('2D ထီ အခြေအနေ ပြောင်းလဲပြီးပါပြီ', 'success');
            } catch (error) {
                showAlert(error.message, 'danger');
                e.target.checked = !e.target.checked;
            }
        });

        // Number Selection
        document.querySelectorAll('.number-item').forEach(item => {
            item.addEventListener('click', () => {
                item.classList.toggle('selected');
                this.updateSelectedNumbers();
            });
        });

        // Form Submission
        document.getElementById('2dControlForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            
            const settings = {
                closeTime: formData.get('closeTime'),
                blockedNumbers: this.getSelectedNumbers(),
                numberLimits: this.getNumberLimits('2d')
            };

            try {
                await this.adminService.updateLotteryControl('2d', settings);
                showAlert('2D ထိန်းချုပ်မှု အပြင်အဆင်များ သိမ်းဆည်းပြီးပါပြီ', 'success');
            } catch (error) {
                showAlert(error.message, 'danger');
            }
        });
    }

    getSelectedNumbers() {
        const numbers = [];
        document.querySelectorAll('.number-item.selected').forEach(item => {
            numbers.push(item.dataset.number);
        });
        return numbers;
    }

    getNumberLimits(type) {
        const limits = [];
        document.querySelectorAll(`#${type}Limits .number-limit-item`).forEach(item => {
            const number = item.querySelector('input[type="text"]').value;
            const amount = parseInt(item.querySelector('input[type="number"]').value);
            if (number && amount) {
                limits.push({ number, amount });
            }
        });
        return limits;
    }

    destroy() {
        // Cleanup event listeners
    }
} 