export class LotterySaleView {
    constructor(sellerService) {
        this.sellerService = sellerService;
        this.contentArea = document.getElementById('contentArea');
        this.currentType = '2d'; // Default to 2D
        this.selectedNumbers = new Map(); // Store number:amount pairs
    }

    async render() {
        const limits = await this.sellerService.getLimits();
        const customer = await this.sellerService.getCustomerInfo();
        
        this.contentArea.innerHTML = `
            <div class="row">
                <!-- Sale Form -->
                <div class="col-md-8">
                    <div class="sale-form">
                        <!-- Lottery Type Toggle -->
                        <div class="btn-group w-100 mb-4">
                            <button class="btn btn-lg btn-primary active" data-type="2d">
                                ၂ လုံး
                            </button>
                            <button class="btn btn-lg btn-outline-primary" data-type="3d">
                                ၃ လုံး
                            </button>
                        </div>

                        <!-- Number Input Section -->
                        <div class="number-input-section mb-4">
                            <div class="input-group mb-3">
                                <input type="text" class="form-control form-control-lg" 
                                    id="numberInput" placeholder="ဂဏန်းရိုက်ထည့်ပါ">
                                <input type="number" class="form-control form-control-lg" 
                                    id="amountInput" placeholder="ငွေပမာဏ">
                                <button class="btn btn-success btn-lg" id="addNumber">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            <div class="small text-muted">
                                အနိမ့်ဆုံး: ${limits.minAmount}Ks, 
                                အမြင့်ဆုံး: ${limits.maxAmount}Ks
                            </div>
                        </div>

                        <!-- Quick Amount Buttons -->
                        <div class="quick-amounts mb-4">
                            <button class="btn btn-outline-primary" data-amount="1000">1,000</button>
                            <button class="btn btn-outline-primary" data-amount="5000">5,000</button>
                            <button class="btn btn-outline-primary" data-amount="10000">10,000</button>
                            <button class="btn btn-outline-primary" data-amount="50000">50,000</button>
                        </div>

                        <!-- Selected Numbers -->
                        <div class="selected-numbers mb-4">
                            <h5>ရွေးချယ်ထားသော ဂဏန်းများ</h5>
                            <div class="table-container">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>ဂဏန်း</th>
                                            <th>ငွေပမာဏ</th>
                                            <th>လုပ်ဆောင်ချက်</th>
                                        </tr>
                                    </thead>
                                    <tbody id="selectedNumbersList">
                                        <!-- Dynamic content -->
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Customer Info -->
                        <div class="customer-section mb-4">
                            <h5>ထီထိုးသူ အချက်အလက်</h5>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>အမည်</label>
                                        <input type="text" class="form-control" id="customerName"
                                            value="${customer?.name || ''}" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>ဖုန်းနံပါတ်</label>
                                        <input type="tel" class="form-control" id="customerPhone"
                                            value="${customer?.phone || ''}" required>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Payment Method -->
                        <div class="payment-section mb-4">
                            <h5>ငွေပေးချေမှု</h5>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="paymentType" 
                                    id="cashPayment" value="cash" checked>
                                <label class="form-check-label" for="cashPayment">
                                    လက်ငင်း
                                </label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="paymentType" 
                                    id="creditPayment" value="credit">
                                <label class="form-check-label" for="creditPayment">
                                    အကြွေး
                                </label>
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <button class="btn btn-primary btn-lg w-100" id="submitSale">
                            ထီရောင်းချမည်
                        </button>
                    </div>
                </div>

                <!-- Summary Card -->
                <div class="col-md-4">
                    <div class="sale-summary card">
                        <div class="card-body">
                            <h5 class="card-title">အကျဉ်းချုပ်</h5>
                            
                            <div class="summary-item">
                                <span>စုစုပေါင်း ဂဏန်း</span>
                                <span id="totalNumbers">0</span>
                            </div>
                            
                            <div class="summary-item">
                                <span>စုစုပေါင်း ငွေပမာဏ</span>
                                <span id="totalAmount">0 Ks</span>
                            </div>

                            <hr>

                            <div class="customer-credit mt-3" id="creditInfo">
                                <h6>အကြွေး အခြေအနေ</h6>
                                <div class="summary-item">
                                    <span>လက်ကျန်အကြွေး</span>
                                    <span>${customer?.credit?.toLocaleString() || '0'} Ks</span>
                                </div>
                                <div class="summary-item">
                                    <span>အကြွေးကန့်သတ်</span>
                                    <span>${customer?.creditLimit?.toLocaleString() || '0'} Ks</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        // Lottery Type Toggle
        document.querySelectorAll('[data-type]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentType = e.target.dataset.type;
                // Update UI
                document.querySelectorAll('[data-type]').forEach(b => 
                    b.classList.toggle('active', b === e.target));
                // Clear selections
                this.selectedNumbers.clear();
                this.updateSelectedNumbersList();
            });
        });

        // Quick Amount Buttons
        document.querySelectorAll('[data-amount]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.getElementById('amountInput').value = e.target.dataset.amount;
            });
        });

        // Add Number Button
        document.getElementById('addNumber').addEventListener('click', () => {
            const number = document.getElementById('numberInput').value;
            const amount = parseInt(document.getElementById('amountInput').value);

            if (this.validateNumber(number) && this.validateAmount(amount)) {
                this.selectedNumbers.set(number, amount);
                this.updateSelectedNumbersList();
                // Clear inputs
                document.getElementById('numberInput').value = '';
                document.getElementById('amountInput').value = '';
            }
        });

        // Submit Sale
        document.getElementById('submitSale').addEventListener('click', async () => {
            if (!this.selectedNumbers.size) {
                showAlert('ဂဏန်းရွေးချယ်ပါ', 'warning');
                return;
            }

            const saleData = {
                type: this.currentType,
                numbers: Array.from(this.selectedNumbers.entries()).map(([number, amount]) => ({
                    number,
                    amount
                })),
                customer: {
                    name: document.getElementById('customerName').value,
                    phone: document.getElementById('customerPhone').value
                },
                paymentType: document.querySelector('input[name="paymentType"]:checked').value
            };

            try {
                const result = await this.sellerService.submitSale(saleData);
                showAlert('ထီရောင်းချမှု အောင်မြင်ပါသည်', 'success');
                // Print receipt
                this.printReceipt(result.saleId);
                // Clear form
                this.selectedNumbers.clear();
                this.updateSelectedNumbersList();
            } catch (error) {
                showAlert(error.message, 'danger');
            }
        });
    }

    validateNumber(number) {
        const pattern = this.currentType === '2d' ? /^\d{2}$/ : /^\d{3}$/;
        if (!pattern.test(number)) {
            showAlert(`${this.currentType === '2d' ? '၂' : '၃'} လုံး ဂဏန်း ရိုက်ထည့်ပါ`, 'warning');
            return false;
        }
        return true;
    }

    validateAmount(amount) {
        if (!amount || amount <= 0) {
            showAlert('မှန်ကန်သော ငွေပမာဏ ရိုက်ထည့်ပါ', 'warning');
            return false;
        }
        return true;
    }

    updateSelectedNumbersList() {
        const tbody = document.getElementById('selectedNumbersList');
        tbody.innerHTML = Array.from(this.selectedNumbers.entries())
            .map(([number, amount]) => `
                <tr>
                    <td>${number}</td>
                    <td>${amount.toLocaleString()} Ks</td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="removeNumber('${number}')">
                            <i class="fas fa-times"></i>
                        </button>
                    </td>
                </tr>
            `).join('');

        // Update summary
        document.getElementById('totalNumbers').textContent = this.selectedNumbers.size;
        const totalAmount = Array.from(this.selectedNumbers.values())
            .reduce((sum, amount) => sum + amount, 0);
        document.getElementById('totalAmount').textContent = `${totalAmount.toLocaleString()} Ks`;
    }

    async printReceipt(saleId) {
        const receipt = await this.sellerService.getReceipt(saleId);
        // Implement receipt printing logic
    }

    destroy() {
        // Cleanup event listeners
    }
} 