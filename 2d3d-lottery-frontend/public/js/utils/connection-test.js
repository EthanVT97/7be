export class ConnectionTest {
    static async checkConnection() {
        try {
            const response = await fetch('https://twod3dbe.onrender.com/health.php');
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error('Backend connection failed');
            }

            return {
                status: 'connected',
                details: data
            };
        } catch (error) {
            console.error('Connection test failed:', error);
            return {
                status: 'disconnected',
                error: error.message
            };
        }
    }

    static async testDatabaseConnection() {
        try {
            const response = await fetch('https://twod3dbe.onrender.com/api/test/database');
            const data = await response.json();
            
            return {
                status: data.database ? 'connected' : 'disconnected',
                details: data
            };
        } catch (error) {
            console.error('Database test failed:', error);
            return {
                status: 'disconnected',
                error: error.message
            };
        }
    }
} 