const config = {
    // API ဆာဗာလိပ်စာ
    API_URL: 'https://twod3d-lottery-api-q68w.onrender.com',
    API_BASE_URL: 'https://twod3d-lottery-api-q68w.onrender.com/api',
    APP_ENV: 'production',
    
    // API Endpoints
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login.php',
            REGISTER: '/auth/register.php',
            LOGOUT: '/auth/logout.php',
            VERIFY: '/auth/verify.php',
            PROFILE: '/auth/profile.php',
            CHANGE_PASSWORD: '/auth/change-password.php'
        },
        LOTTERY: {
            LIVE: '/lottery/live.php',
            HISTORY: '/lottery/history.php',
            BET: '/lottery/bet.php',
            RESULTS: '/lottery/results.php'
        },
        TRANSACTION: {
            DEPOSIT: '/transaction/deposit.php',
            WITHDRAW: '/transaction/withdraw.php',
            HISTORY: '/transaction/history.php'
        }
    },
    
    // အနိမ့်ဆုံးထိုးငွေနှင့် ငွေသွင်း/ထုတ်ကန့်သတ်ချက်များ
    MIN_BET_AMOUNT: 100,
    MIN_DEPOSIT_AMOUNT: 1000,
    MAX_WITHDRAW_AMOUNT: 1000000,
    
    // ထီပိတ်ချိန်များ
    CLOSE_TIMES: {
        '2D': {
            MORNING: '10:30',  // မနက်ပိုင်း
            EVENING: '16:30'   // ညနေပိုင်း
        },
        '3D': {
            DAILY: '16:30'     // နေ့စဉ်
        }
    },
    
    // အကောင့်ဝင်ရောက်မှုဆိုင်ရာ
    AUTH: {
        TOKEN_KEY: 'auth_token',
        USER_KEY: 'user_data',
        SESSION_DURATION: 86400, // ၂၄ နာရီ (စက္ကန့်ဖြင့်)
        TOKEN_REFRESH_THRESHOLD: 3600 // ၁ နာရီ မတိုင်မီ token ပြန်လည်ရယူရန်
    },

    // Performance settings
    REFRESH_INTERVAL: 30000, // 30 seconds
    RATE_LIMIT: {
        REQUESTS_PER_MINUTE: 60,
        RETRY_AFTER: 60 // seconds to wait after rate limit hit
    },
    
    // Error messages
    ERROR_MESSAGES: {
        NETWORK_ERROR: 'ဆာဗာနှင့် ဆက်သွယ်၍ မရပါ။ အင်တာနက် ချိတ်ဆက်မှုကို စစ်ဆေးပါ',
        SESSION_EXPIRED: 'သင့်အကောင့် သက်တမ်းကုန်ဆုံးသွားပါပြီ။ ပြန်လည်ဝင်ရောက်ပါ',
        INVALID_CREDENTIALS: 'ဖုန်းနံပါတ် သို့မဟုတ် လျှို့ဝှက်နံပါတ် မှားယွင်းနေပါသည်',
        RATE_LIMIT: 'တောင်းဆိုမှု များလွန်းပါသည်။ ခဏစောင့်ပြီး ပြန်လည်ကြိုးစားပါ'
    }
};

export default config;
