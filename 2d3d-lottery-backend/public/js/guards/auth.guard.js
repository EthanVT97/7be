import config from '../config.js';

export class AuthGuard {
    // အကောင့်ဝင်ရောက်ထားခြင်း ရှိ/မရှိ စစ်ဆေးခြင်း
    static checkAuth() {
        const token = localStorage.getItem(config.AUTH.TOKEN_KEY);
        const user = localStorage.getItem(config.AUTH.USER_KEY);
        
        if (!token || !user) {
            return false;
        }

        try {
            const userData = JSON.parse(user);
            const tokenExpiry = new Date(userData.exp * 1000);
            
            // အကောင့်သက်တမ်းကုန်ဆုံးချိန် စစ်ဆေးခြင်း
            if (tokenExpiry < new Date()) {
                this.clearAuth();
                return false;
            }
            
            return true;
        } catch (error) {
            this.clearAuth();
            return false;
        }
    }

    // အကောင့်အချက်အလက်များ ရှင်းလင်းခြင်း
    static clearAuth() {
        localStorage.removeItem(config.AUTH.TOKEN_KEY);
        localStorage.removeItem(config.AUTH.USER_KEY);
    }

    // အကောင့်ဝင်ရန် စာမျက်နှာသို့ လမ်းကြောင်းပြောင်းခြင်း
    static redirectToLogin() {
        window.location.href = '/login';
    }
} 