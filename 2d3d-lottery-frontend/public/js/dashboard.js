import config from './config.js';

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }
    return token;
}

// Show alerts
function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    alertContainer.appendChild(alert);
    setTimeout(() => alert.remove(), 5000);
}

// Load user data
async function loadUserData() {
    const token = checkAuth();
    try {
        const response = await fetch(`${config.API_BASE_URL}/api/user/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('username').textContent = data.user.username;
            document.getElementById('userFullName').textContent = data.user.username;
            document.getElementById('userBalance').textContent = data.user.balance.toLocaleString();
        }
    } catch (error) {
        showAlert('ပရိုဖိုင်အချက်အလက်များ ရယူ၍မရပါ။', 'danger');
    }
}

// Modal functions
window.showDepositModal = function() {
    const modal = new bootstrap.Modal(document.getElementById('depositModal'));
    modal.show();
};

window.showWithdrawModal = function() {
    const modal = new bootstrap.Modal(document.getElementById('withdrawModal'));
    modal.show();
};

window.showTransactionHistory = async function() {
    const token = checkAuth();
    try {
        const response = await fetch(`${config.API_BASE_URL}/api/transactions`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        
        if (data.success) {
            // Update transaction history modal content
            const tbody = document.querySelector('#transactionHistoryModal .modal-body tbody');
            tbody.innerHTML = data.transactions.map(t => `
                <tr>
                    <td>${new Date(t.created_at).toLocaleString()}</td>
                    <td>${t.type === 'deposit' ? 'ငွေသွင်း' : 'ငွေထုတ်'}</td>
                    <td>${t.amount.toLocaleString()} ကျပ်</td>
                    <td>${t.status}</td>
                </tr>
            `).join('');
        }
    } catch (error) {
        showAlert('မှတ်တမ်းများ ရယူ၍မရပါ။', 'danger');
    }
    
    const modal = new bootstrap.Modal(document.getElementById('transactionHistoryModal'));
    modal.show();
};

// Lottery functions
window.play2D = function() {
    const modal = new bootstrap.Modal(document.getElementById('2dModal'));
    modal.show();
};

window.play3D = function() {
    const modal = new bootstrap.Modal(document.getElementById('3dModal'));
    modal.show();
};

window.playLao = function() {
    const modal = new bootstrap.Modal(document.getElementById('laoModal'));
    modal.show();
};

// Logout function
window.logout = function() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadUserData();
    loadWinningNumbers();
});

// Copy payment number
window.copyPaymentNumber = function() {
    const number = document.getElementById('paymentNumber');
    navigator.clipboard.writeText(number.value);
    showAlert('ဖုန်းနံပါတ် ကော်ပီကူးပြီးပါပြီ။');
};

// Handle deposit form
document.getElementById('depositForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = checkAuth();
    
    try {
        const formData = new FormData();
        formData.append('payment_method', document.querySelector('input[name="paymentMethod"]:checked').value);
        formData.append('amount', document.getElementById('depositAmount').value);
        formData.append('image', document.getElementById('transactionImage').files[0]);

        const response = await fetch(`${config.API_BASE_URL}/api/transactions/deposit`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const data = await response.json();
        
        if (data.success) {
            showAlert(data.message);
            bootstrap.Modal.getInstance(document.getElementById('depositModal')).hide();
            loadUserData(); // Refresh balance
        } else {
            showAlert(data.message, 'danger');
        }
    } catch (error) {
        showAlert('ငွေသွင်းခြင်း မအောင်မြင်ပါ။', 'danger');
    }
});

// Handle withdraw form
document.getElementById('withdrawForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = checkAuth();
    
    try {
        const response = await fetch(`${config.API_BASE_URL}/api/transactions/withdraw`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: document.getElementById('withdrawAmount').value,
                password: document.getElementById('withdrawPassword').value
            })
        });

        const data = await response.json();
        
        if (data.success) {
            showAlert(data.message);
            bootstrap.Modal.getInstance(document.getElementById('withdrawModal')).hide();
            loadUserData(); // Refresh balance
        } else {
            showAlert(data.message, 'danger');
        }
    } catch (error) {
        showAlert('ငွေထုတ်ခြင်း မအောင်မြင်ပါ။', 'danger');
    }
});

// Set user's phone in withdraw form when modal opens
document.getElementById('withdrawModal')?.addEventListener('show.bs.modal', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    document.getElementById('userPhone').value = user.phone;
});

// 2D Functions
function generate2DPad() {
    const container = document.querySelector('.quick-numbers');
    let html = '';
    
    for (let i = 0; i < 100; i++) {
        const num = i.toString().padStart(2, '0');
        html += `
            <button type="button" class="btn btn-outline-primary number-btn" onclick="add2DNumber('${num}')">
                ${num}
            </button>
        `;
    }
    
    container.innerHTML = html;
}

window.add2DNumber = function(num) {
    const input = document.getElementById('2dNumbers');
    const numbers = input.value ? input.value.split(',') : [];
    
    if (!numbers.includes(num)) {
        numbers.push(num);
        input.value = numbers.join(',');
        update2DSummary();
    }
};

window.clear2DNumbers = function() {
    document.getElementById('2dNumbers').value = '';
    update2DSummary();
};

function update2DSummary() {
    const numbers = document.getElementById('2dNumbers').value.split(',').filter(n => n);
    const amount = parseInt(document.getElementById('2dAmount').value) || 0;
    const type = document.querySelector('input[name="2dType"]:checked').value;
    
    let totalNumbers = numbers.length;
    if (type === 'reverse') totalNumbers *= 2;
    else if (type === 'power') totalNumbers *= 10;
    else if (type === 'round') totalNumbers *= 100;
    
    document.getElementById('2dTotalNumbers').textContent = totalNumbers;
    document.getElementById('2dTotalAmount').textContent = `${(totalNumbers * amount).toLocaleString()} ကျပ်`;
}

// 3D Functions
window.generate3DRandom = function() {
    const count = 5; // Generate 5 random numbers
    const numbers = [];
    
    for (let i = 0; i < count; i++) {
        let num = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        numbers.push(num);
    }
    
    document.getElementById('3dNumbers').value = numbers.join(',');
    update3DSummary();
};

window.generate3DTwin = function() {
    const numbers = [];
    for (let i = 0; i < 10; i++) {
        numbers.push(`${i}${i}${i}`);
    }
    document.getElementById('3dNumbers').value = numbers.join(',');
    update3DSummary();
};

window.generate3DSequential = function() {
    const numbers = [];
    for (let i = 0; i < 10; i++) {
        numbers.push(`${i}${(i+1)%10}${(i+2)%10}`);
    }
    document.getElementById('3dNumbers').value = numbers.join(',');
    update3DSummary();
};

window.clear3DNumbers = function() {
    document.getElementById('3dNumbers').value = '';
    update3DSummary();
};

function update3DSummary() {
    const numbers = document.getElementById('3dNumbers').value.split(',').filter(n => n);
    const amount = parseInt(document.getElementById('3dAmount').value) || 0;
    const type = document.querySelector('input[name="3dType"]:checked').value;
    
    let totalNumbers = numbers.length;
    if (type === 'permutation') totalNumbers *= 6;
    else if (type === 'front2' || type === 'back2') totalNumbers *= 1;
    
    document.getElementById('3dTotalNumbers').textContent = totalNumbers;
    document.getElementById('3dTotalAmount').textContent = `${(totalNumbers * amount).toLocaleString()} ကျပ်`;
}

// Event Listeners
document.getElementById('2dForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = checkAuth();
    
    try {
        const response = await fetch(`${config.API_BASE_URL}/api/bets/2d`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                time: document.querySelector('input[name="2dTime"]:checked').value,
                type: document.querySelector('input[name="2dType"]:checked').value,
                numbers: document.getElementById('2dNumbers').value.split(',').filter(n => n),
                amount: parseInt(document.getElementById('2dAmount').value)
            })
        });

        const data = await response.json();
        
        if (data.success) {
            showAlert(data.message);
            bootstrap.Modal.getInstance(document.getElementById('2dModal')).hide();
            loadUserData(); // Refresh balance
        } else {
            showAlert(data.message, 'danger');
        }
    } catch (error) {
        showAlert('ထီထိုးခြင်း မအောင်မြင်ပါ။', 'danger');
    }
});

document.getElementById('3dForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = checkAuth();
    
    try {
        const response = await fetch(`${config.API_BASE_URL}/api/bets/3d`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: document.querySelector('input[name="3dType"]:checked').value,
                numbers: document.getElementById('3dNumbers').value.split(',').filter(n => n),
                amount: parseInt(document.getElementById('3dAmount').value)
            })
        });

        const data = await response.json();
        
        if (data.success) {
            showAlert(data.message);
            bootstrap.Modal.getInstance(document.getElementById('3dModal')).hide();
            loadUserData(); // Refresh balance
        } else {
            showAlert(data.message, 'danger');
        }
    } catch (error) {
        showAlert('ထီထိုးခြင်း မအောင်မြင်ပါ။', 'danger');
    }
});

// Initialize number pad when 2D modal opens
document.getElementById('2dModal')?.addEventListener('show.bs.modal', generate2DPad);

// Update summaries when inputs change
['2dNumbers', '2dAmount'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', update2DSummary);
});

['3dNumbers', '3dAmount'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', update3DSummary);
});

document.querySelectorAll('input[name="2dType"]').forEach(radio => {
    radio.addEventListener('change', update2DSummary);
});

document.querySelectorAll('input[name="3dType"]').forEach(radio => {
    radio.addEventListener('change', update3DSummary);
});

// Check balance before betting
function checkBalance(amount) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.balance < amount) {
        showAlert('လက်ကျန်ငွေ မလုံလောက်ပါ။ ကျေးဇူးပြု၍ ငွေသွင်းပါ။', 'warning');
        return false;
    }
    return true;
}

// Show betting history
window.showBettingHistory = async function() {
    const token = checkAuth();
    try {
        // Fetch 2D history
        const response2D = await fetch(`${config.API_BASE_URL}/api/bets/2d/history`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data2D = await response2D.json();
        
        if (data2D.success) {
            document.getElementById('2dHistoryBody').innerHTML = data2D.bets.map(bet => `
                <tr>
                    <td>${new Date(bet.created_at).toLocaleDateString()}</td>
                    <td>${bet.time === 'morning' ? 'မနက်' : 'ညနေ'}</td>
                    <td>${getBetTypeName(bet.type)}</td>
                    <td>${bet.numbers.join(', ')}</td>
                    <td>${bet.amount.toLocaleString()} ကျပ်</td>
                    <td>${getBetStatus(bet.status)}</td>
                </tr>
            `).join('');
        }

        // Fetch 3D history
        const response3D = await fetch(`${config.API_BASE_URL}/api/bets/3d/history`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data3D = await response3D.json();
        
        if (data3D.success) {
            document.getElementById('3dHistoryBody').innerHTML = data3D.bets.map(bet => `
                <tr>
                    <td>${new Date(bet.created_at).toLocaleDateString()}</td>
                    <td>${getBetTypeName(bet.type)}</td>
                    <td>${bet.numbers.join(', ')}</td>
                    <td>${bet.amount.toLocaleString()} ကျပ်</td>
                    <td>${getBetStatus(bet.status)}</td>
                </tr>
            `).join('');
        }
    } catch (error) {
        showAlert('မှတ်တမ်းများ ရယူ၍မရပါ။', 'danger');
    }
    
    const modal = new bootstrap.Modal(document.getElementById('bettingHistoryModal'));
    modal.show();
};

// Helper functions
function getBetTypeName(type) {
    const types = {
        'straight': 'တိုက်ရိုက်',
        'reverse': 'အပြန်',
        'twin': 'စုံပူး',
        'power': 'ပါဝါ',
        'round': 'ဝိုင်း',
        'permutation': 'ဘရိတ်',
        'front2': 'ရှေ့ ၂ လုံး',
        'back2': 'နောက် ၂ လုံး'
    };
    return types[type] || type;
}

function getBetStatus(status) {
    const statuses = {
        'pending': '<span class="badge bg-warning">စောင့်ဆိုင်းဆဲ</span>',
        'won': '<span class="badge bg-success">ပေါက်</span>',
        'lost': '<span class="badge bg-danger">မပေါက်</span>'
    };
    return statuses[status] || status;
}

// Check betting time
function checkBettingTime(time) {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();

    if (time === 'morning' && (hour > 9 || (hour === 9 && minute > 30))) {
        showAlert('မနက်ပိုင်း ���ီပိတ်ချိန် (9:30) ကျော်လွန်သွားပါပြီ', 'warning');
        return false;
    }
    
    if (time === 'evening' && (hour > 15 || (hour === 15 && minute > 30))) {
        showAlert('ညနေပိုင်း ထီပိတ်ချိန် (3:30) ကျော်လွန်သွားပါပြီ', 'warning');
        return false;
    }

    return true;
}

// Update 2D form submit
document.getElementById('2dForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const time = document.querySelector('input[name="2dTime"]:checked').value;
    if (!checkBettingTime(time)) return;
    
    const token = checkAuth();
    const amount = parseInt(document.getElementById('2dAmount').value);
    const numbers = document.getElementById('2dNumbers').value.split(',').filter(n => n);
    const type = document.querySelector('input[name="2dType"]:checked').value;
    
    let totalAmount = amount * numbers.length;
    if (type === 'reverse') totalAmount *= 2;
    else if (type === 'power') totalAmount *= 10;
    else if (type === 'round') totalAmount *= 100;

    if (!checkBalance(totalAmount)) return;

    try {
        const response = await fetch(`${config.API_BASE_URL}/api/bets/2d`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                time: document.querySelector('input[name="2dTime"]:checked').value,
                type: document.querySelector('input[name="2dType"]:checked').value,
                numbers: document.getElementById('2dNumbers').value.split(',').filter(n => n),
                amount: parseInt(document.getElementById('2dAmount').value)
            })
        });

        const data = await response.json();
        
        if (data.success) {
            showAlert(data.message);
            bootstrap.Modal.getInstance(document.getElementById('2dModal')).hide();
            loadUserData(); // Refresh balance
        } else {
            showAlert(data.message, 'danger');
        }
    } catch (error) {
        showAlert('ထီထိုးခြင်း မအောင်မြင်ပါ။', 'danger');
    }
});

document.getElementById('3dForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const amount = parseInt(document.getElementById('3dAmount').value);
    const numbers = document.getElementById('3dNumbers').value.split(',').filter(n => n);
    const type = document.querySelector('input[name="3dType"]:checked').value;
    
    let totalAmount = amount * numbers.length;
    if (type === 'permutation') totalAmount *= 6;

    if (!checkBalance(totalAmount)) return;

    // Rest of the existing code...
});

// Load winning numbers
async function loadWinningNumbers() {
    const token = checkAuth();
    try {
        const response = await fetch(`${config.API_BASE_URL}/api/winning-numbers`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        
        if (data.success) {
            // Update 2D numbers
            document.getElementById('morning2d').textContent = data.morning2d || '-';
            document.getElementById('evening2d').textContent = data.evening2d || '-';
            
            // Update 3D number
            document.getElementById('latest3d').textContent = data.latest3d || '-';
        }
    } catch (error) {
        console.error('Failed to load winning numbers');
    }
}

// Add to initialization
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadUserData();
    loadWinningNumbers();
});

// Filter betting history
window.filterBettingHistory = function(type, filter) {
    const tbody = document.getElementById(`${type}HistoryBody`);
    const rows = tbody.getElementsByTagName('tr');
    
    for (let row of rows) {
        const text = row.textContent.toLowerCase();
        const searchText = filter.toLowerCase();
        
        if (text.includes(searchText)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    }
};

// Add date range filter
window.filterByDateRange = function(type, startDate, endDate) {
    const tbody = document.getElementById(`${type}HistoryBody`);
    const rows = tbody.getElementsByTagName('tr');
    
    for (let row of rows) {
        const date = new Date(row.cells[0].textContent);
        if (date >= startDate && date <= endDate) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    }
};

// Quick pick functions for 2D
window.quickPick2D = {
    // ညီကိန်းများ (00, 11, 22, ...)
    twins: function() {
        const numbers = [];
        for (let i = 0; i < 10; i++) {
            numbers.push(`${i}${i}`);
        }
        document.getElementById('2dNumbers').value = numbers.join(',');
        update2DSummary();
    },
    
    // စုံစုံ (00, 22, 44, 66, 88)
    evenTwins: function() {
        const numbers = [];
        for (let i = 0; i < 10; i += 2) {
            numbers.push(`${i}${i}`);
        }
        document.getElementById('2dNumbers').value = numbers.join(',');
        update2DSummary();
    },
    
    // မမ (11, 33, 55, 77, 99)
    oddTwins: function() {
        const numbers = [];
        for (let i = 1; i < 10; i += 2) {
            numbers.push(`${i}${i}`);
        }
        document.getElementById('2dNumbers').value = numbers.join(',');
        update2DSummary();
    }
};

// Export betting history to CSV
window.exportToCSV = function(type) {
    const table = document.querySelector(`#${type}History table`);
    let csv = [];
    
    // Get headers
    const headers = [];
    for (let cell of table.rows[0].cells) {
        headers.push(cell.textContent);
    }
    csv.push(headers.join(','));
    
    // Get data
    for (let row of table.tBodies[0].rows) {
        const data = [];
        for (let cell of row.cells) {
            data.push(cell.textContent);
        }
        csv.push(data.join(','));
    }
    
    // Download
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-history.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}; 