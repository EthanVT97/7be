export const API_CONFIG = {
    BASE_URL: 'http://localhost:8000',
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/api/auth/login',
            REGISTER: '/api/auth/register',
            LOGOUT: '/api/auth/logout'
        },
        USERS: {
            LIST: '/api/users',
            CREATE: '/api/users/create',
            UPDATE: '/api/users/update',
            DELETE: '/api/users/delete'
        },
        SALES: {
            LIST: '/api/sales',
            CREATE: '/api/sales/create',
            UPDATE: '/api/sales/update',
            DELETE: '/api/sales/delete'
        },
        NUMBERS: {
            LIST: '/api/numbers',
            CREATE: '/api/numbers/create'
        },
        HEALTH: '/health',
        TEST: '/api/test/database'
    }
}; 