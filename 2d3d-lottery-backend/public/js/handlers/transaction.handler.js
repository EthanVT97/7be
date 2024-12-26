import { UserService } from '../services/user.service.js';
import { showNotification } from '../utils/notification.utils.js';

export class TransactionHandler {
    // ငွေသွင်းခြင်း Modal ကို ပြသခြင်း
    static showDepositModal() {
        const modal = new bootstrap.Modal(document.getElementById('depositModal'));
        modal.show();
    }

    // ငွေထုတ်ခြင်း Modal ကို ပြသခြင်း
    static showWithdrawModal() {
        const modal = new bootstrap.Modal(document.getElementById('withdrawModal'));
        modal.show();
    }

    // ငွေသွင်းခြင်း Form ကို စီမံခြင်း
    static async handleDeposit(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        try {
            // ငွေပမာဏ စစ်ဆေးခြင်း
            const amount = Number(formData.get('amount'));
            if (amount < 1000) {
                throw new Error('အနည်းဆုံး ၁,၀၀၀ ကျပ် သွင်းရပါမည်');
            }

            // ငွေလွှဲပြေစာပုံ စစ်ဆေးခြင်း
            const image = formData.get('transaction_image');
            if (!image || image.size === 0) {
                throw new Error('ငွေလွှဲပြေစာပုံ ထည့်သွင်းရန် လိုအပ်ပါသည်');
            }

            // Loading ပြခြင်း
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> စောင့်ဆိုင်းပါ...';

            // ငွေသွင်းခြင်း တောင်းဆိုမှု
            await UserService.deposit(
                amount,
                formData.get('payment_method'),
                image
            );

            // အောင်မြင်ကြောင်း ပြသခြင်း
            showNotification('ငွေသွင်းခြင်း အောင်မြင်ပါသည်။ အတည်ပြုချက်ကို စောင့်ဆိုင်းပါ', 'success');
            
            // Modal ပိတ်ခြင်း
            bootstrap.Modal.getInstance(document.getElementById('depositModal')).hide();
            
            // Form ရှင်းလင်းခြင်း
            form.reset();
            
            // လက်ကျန်ငွေ ပြန်လည်ဖော်ပြခြင်း
            await loadBalance();

        } catch (error) {
            showNotification(error.message || 'ငွေသွင်းခြင်း မအောင်မြင်ပါ', 'error');
        } finally {
            // Submit ခလုတ် ပြန်လည်ဖွင့်ခြင်း
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }

    // ငွေထုတ်ခြင်း Form ကို စီမံခြင်း
    static async handleWithdraw(event) {
        event.preventDefault();
        const form = event.target;
        
        try {
            const amount = Number(form.amount.value);
            const password = form.password.value;

            // ငွေပမာဏ စစ်ဆေးခြင်း
            if (amount < 5000) {
                throw new Error('အနည်းဆုံး ၅,၀၀၀ ကျပ် ထုတ်ယူရပါမည်');
            }

            // Loading ပြခြင်း
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> စောင့်ဆိုင်းပါ...';

            // ငွေထုတ်ခြင်း တောင်းဆိုမှု
            await UserService.withdraw(amount, password);

            // အောင်မြင်ကြောင်း ပြသခြင်း
            showNotification('ငွေထုတ်ခြင်း အောင်မြင်ပါသည်။ အတည်ပြုချက်ကို စောင့်ဆိုင်းပါ', 'success');
            
            // Modal ပိတ်ခြင်း
            bootstrap.Modal.getInstance(document.getElementById('withdrawModal')).hide();
            
            // Form ရှင်းလင်းခြင်း
            form.reset();
            
            // လက်ကျန်ငွေ ပြန်လည်ဖော်ပြခြင်း
            await loadBalance();

        } catch (error) {
            showNotification(error.message || 'ငွေထုတ်ခြင်း မအောင်မြင်ပါ', 'error');
        } finally {
            // Submit ခလုတ် ပြန်လည်ဖွင့်ခြင်း
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // ငွေသွင်းခြင်း Form Event
    document.getElementById('depositForm')?.addEventListener('submit', TransactionHandler.handleDeposit);
    
    // ငွေထုတ်ခြင်း Form Event
    document.getElementById('withdrawForm')?.addEventListener('submit', TransactionHandler.handleWithdraw);
}); 