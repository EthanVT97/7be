import { ApiService } from './api.service.js';
import config from '../config.js';

export class AuthService {
    // အကောင့်ဝင်ရောက်ခြင်း
    static async login(phone, password) {
        try {
            const response = await ApiService.request('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ phone, password })
            });

            if (!response || !response.token || !response.user) {
                throw new Error('ဆာဗာမှ တုံ့ပြန်မှု မမှန်ကန်ပါ');
            }

            // Save auth data
            localStorage.setItem(config.AUTH.TOKEN_KEY, response.token);
            localStorage.setItem(config.AUTH.USER_KEY, JSON.stringify(response.user));
            
            // Set token expiry
            const expiryTime = Date.now() + (config.AUTH.SESSION_DURATION * 1000);
            localStorage.setItem('token_expiry', expiryTime.toString());

            return response;
        } catch (error) {
            if (error.status === 401) {
                throw new Error('ဖုန်းနံပါတ် သို့မဟုတ် လျှို့ဝှက်နံပါတ် မှားယွင်းနေပါသည်');
            } else if (error.status === 403) {
                throw new Error('သင့်အကောင့် ပိတ်ထားပါသည်။ စီမံခန့်ခွဲသူကို ဆက်သွယ်ပါ');
            } else if (error.status === 429) {
                throw new Error('ဝင်ရောက်ရန် ကြိုးစားမှု များလွန်းပါသည်။ ခဏစောင့်ပြီး ပြန်လည်ကြိုးစားပါ');
            }
            
            throw new Error(error.message || 'အကောင့်ဝင်ရောက်ရန် မအောင်မြင်ပါ');
        }
    }

    // အကောင့်အသစ်ဖွင့်ခြင်း
    static async register(userData) {
        try {
            const response = await ApiService.request('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response || !response.success) {
                throw new Error('ဆာဗာမှ တုံ့ပြန်မှု မမှန်ကန်ပါ');
            }

            return response;
        } catch (error) {
            if (error.status === 409) {
                throw new Error('ဖုန်းနံပါတ် အသုံးပြုပြီး ဖြစ်နေပါသည်');
            } else if (error.status === 400) {
                throw new Error('ပေးပို့လိုက်သော အချက်အလက်များ မပြည့်စုံပါ');
            } else if (error.status === 429) {
                throw new Error('အကောင့်ဖွင့်ရန် ကြိုးစားမှု များလွန်းပါသည်။ ခဏစောင့်ပြီး ပြန်လည်ကြိုးစားပါ');
            }
            
            throw new Error(error.message || 'အကောင့်ဖွင့်ရန် မအောင်မြင်ပါ');
        }
    }

    // အကောင့်ထွက်ခြင်း
    static async logout() {
        try {
            await ApiService.request('/api/auth/logout', { 
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(config.AUTH.TOKEN_KEY)}`
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear all auth data
            localStorage.removeItem(config.AUTH.TOKEN_KEY);
            localStorage.removeItem(config.AUTH.USER_KEY);
            localStorage.removeItem('token_expiry');
            
            // Redirect to login
            window.location.href = '/login';
        }
    }

    // အကောင့်ဝင်ထားခြင်း ရှိ/မရှိ စစ်ဆေးခြင်း
    static isAuthenticated() {
        const token = localStorage.getItem(config.AUTH.TOKEN_KEY);
        const user = localStorage.getItem(config.AUTH.USER_KEY);
        const expiry = localStorage.getItem('token_expiry');
        
        if (!token || !user || !expiry) {
            return false;
        }
        
        // Check token expiry
        if (Date.now() > parseInt(expiry)) {
            this.logout();
            return false;
        }
        
        return true;
    }
} 