const config = {
    API_BASE_URL: 'https://2d3d-lottery-api.onrender.com/api',
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login.php',
            REGISTER: '/auth/register.php',
            LOGOUT: '/auth/logout.php',
            VERIFY: '/auth/verify.php'
        },
        LOTTERY: {
            LIVE: '/lottery/live',
            HISTORY: '/lottery/history'
        }
    },
    REFRESH_INTERVAL: 30000, // 30 seconds
    RATE_LIMIT: {
        REQUESTS_PER_MINUTE: 60
    }
};

export default config;