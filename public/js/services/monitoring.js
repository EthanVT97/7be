import config from '../config.js';

class MonitoringService {
    constructor() {
        this.errors = new Map();
        this.performanceMetrics = new Map();
        this.userMetrics = new Map();
        this.networkMetrics = {
            requests: 0,
            failures: 0,
            totalLatency: 0
        };
        this.sessionMetrics = {
            startTime: Date.now(),
            pageViews: 0,
            interactions: 0,
            errors: 0
        };
        
        // Initialize performance monitoring
        this.initPerformanceMonitoring();
    }

    initPerformanceMonitoring() {
        // Monitor page load performance
        if (window.performance && window.performance.timing) {
            window.addEventListener('load', () => {
                const timing = window.performance.timing;
                const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
                this.logPerformanceMetric('pageLoad', pageLoadTime);
            });
        }

        // Monitor network status
        window.addEventListener('online', () => this.logNetworkStatus('online'));
        window.addEventListener('offline', () => this.logNetworkStatus('offline'));

        // Monitor user interactions
        document.addEventListener('click', () => this.logUserInteraction('click'));
        document.addEventListener('submit', () => this.logUserInteraction('form_submit'));
    }

    logError(error, type, context = {}) {
        if (!config.MONITORING.ENABLED) return;
        
        if (Math.random() > config.MONITORING.ERROR_SAMPLING_RATE) return;

        const errorKey = `${type}:${error.message}`;
        const errorData = {
            timestamp: new Date().toISOString(),
            message: error.message,
            stack: error.stack,
            type,
            context,
            count: (this.errors.get(errorKey)?.count || 0) + 1,
            browser: navigator.userAgent,
            platform: navigator.platform,
            url: window.location.href,
            sessionDuration: Date.now() - this.sessionMetrics.startTime
        };

        this.errors.set(errorKey, errorData);
        this.sessionMetrics.errors++;
        
        if (config.MONITORING.LOG_LEVEL === 'error') {
            console.error('[Error]', errorData);
        }

        // Send to backend if error count threshold exceeded
        if (errorData.count === 5) {
            this.sendErrorReport(errorData);
        }
    }

    logPerformanceMetric(metric, value) {
        if (!config.MONITORING.ENABLED) return;

        const metrics = this.performanceMetrics.get(metric) || {
            count: 0,
            total: 0,
            min: Infinity,
            max: -Infinity,
            avg: 0
        };

        metrics.count++;
        metrics.total += value;
        metrics.min = Math.min(metrics.min, value);
        metrics.max = Math.max(metrics.max, value);
        metrics.avg = metrics.total / metrics.count;

        this.performanceMetrics.set(metric, metrics);

        if (value > config.MONITORING.PERFORMANCE_THRESHOLD) {
            this.logPerformanceAlert(metric, value);
        }
    }

    logNetworkStatus(status) {
        if (status === 'offline') {
            this.networkMetrics.failures++;
        }
        this.sendNetworkReport(status);
    }

    logUserInteraction(type) {
        this.sessionMetrics.interactions++;
        const interactions = this.userMetrics.get(type) || 0;
        this.userMetrics.set(type, interactions + 1);
    }

    logApiCall(endpoint, duration, success) {
        this.networkMetrics.requests++;
        this.networkMetrics.totalLatency += duration;
        
        if (!success) {
            this.networkMetrics.failures++;
        }

        this.logPerformanceMetric('api_call', duration);
    }

    logPerformanceAlert(metric, value) {
        const alert = {
            metric,
            value,
            threshold: config.MONITORING.PERFORMANCE_THRESHOLD,
            timestamp: new Date().toISOString()
        };

        if (config.MONITORING.LOG_LEVEL === 'warn') {
            console.warn('[Performance Alert]', alert);
        }

        this.sendPerformanceAlert(alert);
    }

    async sendErrorReport(errorData) {
        try {
            await fetch(`${config.API_BASE_URL}/monitoring/error`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(errorData)
            });
        } catch (error) {
            console.error('Failed to send error report:', error);
        }
    }

    async sendPerformanceAlert(alert) {
        try {
            await fetch(`${config.API_BASE_URL}/monitoring/performance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(alert)
            });
        } catch (error) {
            console.error('Failed to send performance alert:', error);
        }
    }

    async sendNetworkReport(status) {
        try {
            await fetch(`${config.API_BASE_URL}/monitoring/network`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status,
                    metrics: this.networkMetrics,
                    timestamp: new Date().toISOString()
                })
            });
        } catch (error) {
            console.error('Failed to send network report:', error);
        }
    }

    getMetrics() {
        return {
            errors: Array.from(this.errors.values()),
            performance: Array.from(this.performanceMetrics.entries()).map(([metric, data]) => ({
                metric,
                ...data
            })),
            network: this.networkMetrics,
            session: {
                ...this.sessionMetrics,
                duration: Date.now() - this.sessionMetrics.startTime
            },
            userInteractions: Array.from(this.userMetrics.entries()).map(([type, count]) => ({
                type,
                count
            }))
        };
    }
}

export const monitoring = new MonitoringService();
