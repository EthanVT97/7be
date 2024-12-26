import config from '../config.js';

class MonitoringService {
    logError(error) {
        console.error('[Monitoring]', error);
        // Implement error logging to backend
    }

    logSuccess(data) {
        console.log('[Monitoring] Success:', data);
        // Implement success logging
    }
}

export const monitoring = new MonitoringService();
