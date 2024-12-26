export const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_URL || 'https://twod3dbe.onrender.com',
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/api/auth/login',
            REGISTER: '/api/auth/register',
            LOGOUT: '/api/auth/logout',
            VERIFY: '/api/auth/verify',
            RESET_PASSWORD: '/api/auth/reset-password'
        },
        USERS: {
            PROFILE: '/api/users/profile',
            UPDATE_PROFILE: '/api/users/profile/update',
            CHANGE_PASSWORD: '/api/users/change-password'
        },
        LOTTERY: {
            TWO_D: {
                BET: '/api/lottery/2d/bet',
                RESULTS: '/api/lottery/2d/results',
                HISTORY: '/api/lottery/2d/history'
            },
            THREE_D: {
                BET: '/api/lottery/3d/bet',
                RESULTS: '/api/lottery/3d/results',
                HISTORY: '/api/lottery/3d/history'
            }
        },
        WALLET: {
            BALANCE: '/api/wallet/balance',
            DEPOSIT: '/api/wallet/deposit',
            WITHDRAW: '/api/wallet/withdraw',
            TRANSACTIONS: '/api/wallet/transactions'
        },
        HEALTH: '/health',
        TEST: '/api/test/database'
    }
}; 