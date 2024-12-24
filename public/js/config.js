const config = {
    API_BASE_URL: 'https://twod3d-lottery-api.onrender.com/api',
    ENDPOINTS: {
        LOTTERY: {
            LIVE: '/lottery/live',
            HISTORY: '/lottery/history',
            RESULTS: '/lottery/results'
        },
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register',
            LOGOUT: '/auth/logout',
            VALIDATE: '/auth/validate'
        }
    },
    SESSION_DURATION: 3600, // 1 hour in seconds
    REQUEST_TIMEOUT: 30000, // 30 seconds in milliseconds
    MAX_RETRY_ATTEMPTS: 3,
    RATE_LIMIT: {
        REQUESTS_PER_MINUTE: 60,
        BURST: 10
    }
};

export default config;