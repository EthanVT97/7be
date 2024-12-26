import { api } from '../services/api.js';
import { security } from '../services/security.js';
import { monitoring } from '../services/monitoring.js';
import ErrorHandler from '../services/errorHandler.js';
import config from '../config.js';

class IntegrationTests {
    constructor() {
        this.tests = [];
        this.results = {
            passed: 0,
            failed: 0,
            errors: []
        };
    }

    async runTests() {
        console.log('Starting Integration Tests...');
        
        // API Tests
        await this.testApiConnection();
        await this.testRateLimiting();
        await this.testAuthFlow();
        await this.testLotteryResults();
        
        // Error Handling Tests
        await this.testErrorHandling();
        await this.testNetworkErrors();
        
        // Security Tests
        await this.testPasswordValidation();
        await this.testTokenRefresh();
        
        // Monitoring Tests
        await this.testPerformanceMonitoring();
        await this.testErrorMonitoring();

        this.displayResults();
    }

    async test(name, testFn) {
        console.log(`Running test: ${name}`);
        try {
            await testFn();
            this.results.passed++;
            console.log(`✓ ${name}`);
        } catch (error) {
            this.results.failed++;
            this.results.errors.push({
                test: name,
                error: error.message
            });
            console.error(`✗ ${name}:`, error.message);
        }
    }

    // API Tests
    async testApiConnection() {
        await this.test('API Connection', async () => {
            const response = await api.call('/');
            if (!response.status === 'success') {
                throw new Error('API connection failed');
            }
        });
    }

    async testRateLimiting() {
        await this.test('Rate Limiting', async () => {
            const requests = Array(70).fill().map(() => api.call('/'));
            try {
                await Promise.all(requests);
                throw new Error('Rate limiting not working');
            } catch (error) {
                if (!error.message.includes('Rate limit exceeded')) {
                    throw error;
                }
            }
        });
    }

    async testAuthFlow() {
        await this.test('Authentication Flow', async () => {
            // Test registration
            const email = `test${Date.now()}@example.com`;
            const password = 'Test123!@#';
            
            // Register
            const auth = window.firebaseAuth;
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const token = await userCredential.user.getIdToken();
            
            // Login
            const loginResponse = await api.call(config.ENDPOINTS.AUTH.LOGIN, 'POST', {
                email,
                token
            });
            
            if (!loginResponse.data?.token) {
                throw new Error('Login failed');
            }
            
            // Cleanup
            await userCredential.user.delete();
        });
    }

    async testLotteryResults() {
        await this.test('Lottery Results', async () => {
            const results = await api.call(config.ENDPOINTS.LOTTERY.LIVE);
            if (!Array.isArray(results.data)) {
                throw new Error('Invalid results format');
            }
        });
    }

    // Error Handling Tests
    async testErrorHandling() {
        await this.test('Error Handler', () => {
            const testError = new Error('Test error');
            testError.status = 401;
            
            const errorDetails = ErrorHandler.handleError(testError);
            if (errorDetails.type !== ErrorHandler.ERROR_TYPES.AUTH) {
                throw new Error('Error not properly categorized');
            }
        });
    }

    async testNetworkErrors() {
        await this.test('Network Error Handling', async () => {
            // Simulate offline
            const originalOnline = navigator.onLine;
            Object.defineProperty(navigator, 'onLine', { value: false, writable: true });
            
            try {
                await api.call('/test');
                throw new Error('Network error not detected');
            } catch (error) {
                const errorDetails = ErrorHandler.handleError(error);
                if (errorDetails.type !== ErrorHandler.ERROR_TYPES.NETWORK) {
                    throw new Error('Network error not properly handled');
                }
            } finally {
                Object.defineProperty(navigator, 'onLine', { value: originalOnline });
            }
        });
    }

    // Security Tests
    async testPasswordValidation() {
        await this.test('Password Validation', () => {
            const weakPassword = 'password';
            const strongPassword = 'StrongP@ssw0rd';
            
            const weakResult = security.validatePassword(weakPassword);
            const strongResult = security.validatePassword(strongPassword);
            
            if (weakResult.valid || !strongResult.valid) {
                throw new Error('Password validation not working correctly');
            }
        });
    }

    async testTokenRefresh() {
        await this.test('Token Refresh', async () => {
            const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
                            'eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.' +
                            'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
            
            localStorage.setItem('authToken', mockToken);
            security.setupTokenRefresh();
            
            // Token should be cleared as it's expired
            if (localStorage.getItem('authToken')) {
                throw new Error('Expired token not cleared');
            }
        });
    }

    // Monitoring Tests
    async testPerformanceMonitoring() {
        await this.test('Performance Monitoring', () => {
            monitoring.logPerformanceMetric('test', 5000);
            const metrics = monitoring.getMetrics();
            
            if (!metrics.performance.find(m => m.metric === 'test')) {
                throw new Error('Performance metric not recorded');
            }
        });
    }

    async testErrorMonitoring() {
        await this.test('Error Monitoring', () => {
            const testError = new Error('Test monitoring error');
            monitoring.logError(testError, 'TEST_TYPE');
            
            const metrics = monitoring.getMetrics();
            if (!metrics.errors.find(e => e.message === 'Test monitoring error')) {
                throw new Error('Error not properly monitored');
            }
        });
    }

    displayResults() {
        console.log('\nTest Results:');
        console.log(`Passed: ${this.results.passed}`);
        console.log(`Failed: ${this.results.failed}`);
        
        if (this.results.errors.length > 0) {
            console.log('\nFailures:');
            this.results.errors.forEach(({ test, error }) => {
                console.error(`${test}: ${error}`);
            });
        }
    }
}

// Run tests
const tester = new IntegrationTests();
tester.runTests().catch(console.error);
