// Common messages in Myanmar
const messages = {
    error: {
        general: 'အမှားတစ်ခု ဖြစ်ပွားခဲ့သည်။ ထပ်မံကြိုးစားကြည့်ပါ။',
        login: 'အကောင့်ဝင်ရောက်မှု မအောင်မြင်ပါ။',
        register: 'အကောင့်ဖွင့်ခြင်း မအောင်မြင်ပါ။',
        passwordMismatch: 'လျှို့ဝှက်နံပါတ်များ မတူညီပါ။',
        invalidNumber: 'ထီနံပါတ် မှားယွင်းနေပါသည်။',
        invalidAmount: 'ငွေပမာဏ မှားယွင်းနေပါသည်။',
        insufficientBalance: 'လက်ကျန်ငွေ မလုံလောက်ပါ။',
        sessionExpired: 'သင့်အကောင့် သက်တမ်းကုန်ဆုံးသွားပါပြီ။ ပြန်လည်ဝင်ရောက်ပါ။'
    },
    success: {
        login: 'အကောင့်ဝင်ရောက်မှု အောင်မြင်ပါသည်။',
        register: 'အကောင့်ဖွင့်ခြင်း အောင်မြင်ပါသည်။',
        betPlaced: 'ထီထိုးခြင်း အောင်မြင်ပါသည်။',
        logout: 'အကောင့်မှ ထွက်ခွာခြင်း အောင်မြင်ပါသည်။'
    }
};

// Show notification
function showNotification(message, type = 'error') {
    // You can replace this with a better notification system
    alert(message);
}

// Format currency in Myanmar style
function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' ကျပ်';
}

// Validate phone number (Myanmar format)
function validatePhoneNumber(phone) {
    const myanmarPhoneRegex = /^(09|\+?959)\d{7,9}$/;
    return myanmarPhoneRegex.test(phone);
}

// Validate lottery numbers
function validateLotteryNumber(number, type = '2d') {
    if (type === '2d') {
        return /^\d{2}$/.test(number);
    } else if (type === '3d') {
        return /^\d{3}$/.test(number);
    }
    return false;
}

// Handle API errors
async function handleApiResponse(response) {
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || messages.error.general);
    }
    return response.json();
}

// Check authentication
async function checkAuth() {
    try {
        const response = await fetch('/api/auth/check', {
            credentials: 'include'
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = '/login';
            }
            return false;
        }
        
        const data = await response.json();
        return data.user;
    } catch (error) {
        console.error('Auth check failed:', error);
        return false;
    }
}

// Handle logout
async function handleLogout(e) {
    e.preventDefault();
    
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
        
        if (response.ok) {
            // Clear any local storage data
            localStorage.clear();
            window.location.href = '/login';
        } else {
            throw new Error('Logout failed');
        }
    } catch (error) {
        console.error('Logout error:', error);
        showNotification('ထွက်ခွာ၍မရပါ။ ထပ်မံကြိုးစားကြည့်ပါ။', 'error');
    }
}

// Initialize lottery forms
function initializeLotteryForms() {
    // 2D form validation
    document.getElementById('2dNumber')?.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^\d]/g, '').slice(0, 2);
    });

    // 3D form validation
    document.getElementById('3dNumber')?.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^\d]/g, '').slice(0, 3);
    });

    // Amount input validation
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', function(e) {
            if (this.value < 100) this.value = 100;
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeLotteryForms();
    
    // Add logout handler
    document.querySelector('.logout-btn')?.addEventListener('click', handleLogout);
    
    // Check authentication on protected pages
    if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        checkAuth();
    }
}); 