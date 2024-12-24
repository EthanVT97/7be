const config = {
    API_BASE_URL: 'https://twod3d-lottery-api.onrender.com/api',
    REQUEST_TIMEOUT: 30000,
    REFRESH_INTERVAL: 60000,
    MAX_RETRIES: 3,
    RATE_LIMIT: {
        MAX_REQUESTS: 60,
        TIME_WINDOW: 60000 // 1 minute
    },
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            LOGOUT: '/auth/logout',
            REFRESH: '/auth/refresh',
            REGISTER: '/auth/register',
            RETRY_STRATEGY: 'immediate'
        },
        LOTTERY: {
            RESULTS_2D: '/2d/results',
            RESULTS_3D: '/3d/results',
            LIVE: '/live',
            RETRY_STRATEGY: 'backoff'
        },
        USER: {
            PROFILE: '/user/profile',
            TRANSACTIONS: '/user/transactions',
            RETRY_STRATEGY: 'timeout'
        }
    },
    SECURITY: {
        TOKEN_REFRESH_BEFORE: 300000, // 5 minutes before expiry
        PASSWORD_MIN_LENGTH: 8,
        REQUIRE_SPECIAL_CHARS: true,
        MAX_LOGIN_ATTEMPTS: 5,
        LOCKOUT_DURATION: 900000 // 15 minutes
    },
    MONITORING: {
        ENABLED: true,
        LOG_LEVEL: 'error', // 'debug' | 'info' | 'warn' | 'error'
        PERFORMANCE_THRESHOLD: 2000, // ms
        ERROR_SAMPLING_RATE: 1.0 // 100% of errors
    },
    FIREBASE_CONFIG: {
        apiKey: "AIzaSyDYj3EIBF1oEuRHK8PODBreiaAboFrGSeE",
        authDomain: "onlin7k.firebaseapp.com",
        projectId: "onlin7k",
        storageBucket: "onlin7k.firebasestorage.app",
        messagingSenderId: "37625358958",
        appId: "1:37625358958:web:2a478628131f752b8b547f"
    }
};

export default config;