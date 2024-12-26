import { ApiService } from './api.service.js';
import config from '../config.js';

export class UserService {
    // အသုံးပြုသူပရိုဖိုင် ရယူခြင်း
    static async getProfile() {
        try {
            return await ApiService.request('/api/user/profile');
        } catch (error) {
            console.error('ပရိုဖိုင်ရယူရန် မအောင်မြင်ပါ:', error);
            throw error;
        }
    }

    // လက်ကျန်ငွေ ရယူခြင်း 
    static async getBalance() {
        try {
            const response = await ApiService.request('/api/user/balance');
            return response.balance;
        } catch (error) {
            console.error('လက်ကျန်ငွေ ရယူရန် မအောင်မြင်ပါ:', error);
            throw error;
        }
    }

    // ငွေသွင်းခြင်း
    static async deposit(amount, paymentMethod, transactionImage) {
        try {
            const formData = new FormData();
            formData.append('amount', amount);
            formData.append('payment_method', paymentMethod);
            formData.append('transaction_image', transactionImage);

            return await ApiService.request('/api/user/deposit', {
                method: 'POST',
                body: formData,
                headers: {
                    // FormData သုံးတဲ့အခါ Content-Type header မထည့်ပါ
                }
            });
        } catch (error) {
            console.error('ငွေသွင်းရန် မအောင်မြင်ပါ:', error);
            throw error;
        }
    }

    // ငွေထုတ်ခြင်း
    static async withdraw(amount, password) {
        try {
            return await ApiService.request('/api/user/withdraw', {
                method: 'POST',
                body: JSON.stringify({
                    amount,
                    password
                })
            });
        } catch (error) {
            console.error('ငွေထုတ်ရန် မအောင်မြင်ပါ:', error);
            throw error;
        }
    }

    // ငွေလွှဲမှတ်တမ်းများ ရယူခြင်း
    static async getTransactions(page = 1, limit = 10) {
        try {
            return await ApiService.request(`/api/user/transactions?page=${page}&limit=${limit}`);
        } catch (error) {
            console.error('ငွေလွှဲမှတ်တမ်းများ ရယူရန် မအောင်မြင်ပါ:', error);
            throw error;
        }
    }

    // ပရိုဖိုင်အချက်အလက် ပြင်ဆင်ခြင်း
    static async updateProfile(data) {
        try {
            return await ApiService.request('/api/user/profile', {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        } catch (error) {
            console.error('ပရိုဖိုင်ပြင်ဆင်ရန် မအောင်မြင်ပါ:', error);
            throw error;
        }
    }

    // လျှို့ဝှက်နံပါတ် ပြောင်းလဲခြင်း
    static async changePassword(currentPassword, newPassword) {
        try {
            return await ApiService.request('/api/user/change-password', {
                method: 'POST',
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword
                })
            });
        } catch (error) {
            console.error('လျှို့ဝှက်နံပါတ် ပြောင်းလဲရန် မအောင်မြင်ပါ:', error);
            throw error;
        }
    }
} 