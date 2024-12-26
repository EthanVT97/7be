import { UserService } from './services/user.service.js';

// ပရိုဖိုင်အချက်အလက်များ ပြသခြင်း
async function loadProfile() {
    try {
        const profile = await UserService.getProfile();
        document.getElementById('username').value = profile.username;
        document.getElementById('phone').value = profile.phone;
        document.getElementById('email').value = profile.email || '';
    } catch (error) {
        showNotification('ပရိုဖိုင်အချက်အလက်များ ရယူ၍မရပါ', 'error');
    }
}

// လက်ကျန်ငွေ ပြသခြင်း
async function loadBalance() {
    try {
        const balance = await UserService.getBalance();
        document.getElementById('userBalance').textContent = 
            `${balance.toLocaleString()} ကျပ်`;
    } catch (error) {
        showNotification('လက်ကျန်ငွေ ရယူ၍မရပါ', 'error');
    }
}

// ငွေလွှဲမှတ်တမ်းများ ပြသခြင်း
let currentPage = 1;
async function loadTransactions(page = 1) {
    try {
        const transactions = await UserService.getTransactions(page);
        const tbody = document.getElementById('transactionsList');
        
        transactions.data.forEach(tx => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDate(tx.created_at)}</td>
                <td>${getTransactionType(tx.type)}</td>
                <td class="${tx.type === 'deposit' ? 'text-success' : 'text-danger'}">
                    ${tx.type === 'deposit' ? '+' : '-'}${tx.amount.toLocaleString()} ကျပ်
                </td>
                <td>${getTransactionStatus(tx.status)}</td>
            `;
            tbody.appendChild(row);
        });

        // နောက်ထပ်ကြည့်ရန် ခလုတ်ကို ထိန်းချုပ်ခြင်း
        const loadMoreBtn = document.getElementById('loadMoreTransactions');
        loadMoreBtn.style.display = transactions.has_more ? 'block' : 'none';
        
    } catch (error) {
        showNotification('ငွေလွှဲမှတ်တမ်းများ ရယူ၍မရပါ', 'error');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    loadBalance();
    loadTransactions();

    // ပရိုဖိုင်ပြင်ဆင်ခြင်း
    document.getElementById('profileForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await UserService.updateProfile({
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value
            });
            showNotification('ပရိုဖိုင်အချက်အလက်များ ပြင်ဆင်ပြီးပါပြီ', 'success');
        } catch (error) {
            showNotification('ပရိုဖိုင်ပြင်ဆင်၍မရပါ', 'error');
        }
    });

    // လျှို့ဝှက်နံပါတ် ပြောင်းလဲခြင်း
    document.getElementById('passwordForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword !== confirmPassword) {
            showNotification('လျှို့ဝှက်နံပါတ်အသစ်များ မတူညီပါ', 'error');
            return;
        }

        try {
            await UserService.changePassword(
                document.getElementById('currentPassword').value,
                newPassword
            );
            showNotification('လျှို့ဝှက်နံပါတ် ပြောင်းလဲပြီးပါပြီ', 'success');
            document.getElementById('passwordForm').reset();
        } catch (error) {
            showNotification('လျှို့ဝှက်နံပါတ် ပြောင်းလဲ၍မရပါ', 'error');
        }
    });

    // နောက်ထပ်ငွေလွှဲမှတ်တမ်းများ ကြည့်ရန်
    document.getElementById('loadMoreTransactions')?.addEventListener('click', () => {
        currentPage++;
        loadTransactions(currentPage);
    });
}); 