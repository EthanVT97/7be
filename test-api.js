const config = {
    API_URL: 'https://twod3d-lottery-api-q68w.onrender.com',
    API_BASE_URL: 'https://twod3d-lottery-api-q68w.onrender.com/api'
};

async function testRegister() {
    try {
        console.log('Sending registration request...');
        const response = await fetch(`${config.API_BASE_URL}/auth/register.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                username: 'testuser',
                email: 'test@example.com',
                phone: '1234567890',
                password: 'test123'
            })
        });
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        const text = await response.text();
        console.log('Raw response:', text);
        try {
            if (text) {
                const data = JSON.parse(text);
                console.log('Registration Response:', data);
                return data.success;
            }
        } catch (parseError) {
            console.error('Failed to parse response:', parseError);
            console.log('Response text:', text);
        }
        return false;
    } catch (error) {
        console.error('Registration Error:', error);
        return false;
    }
}

async function testLogin() {
    try {
        console.log('Sending login request...');
        const response = await fetch(`${config.API_BASE_URL}/auth/login.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                username: 'testuser',
                password: 'test123'
            })
        });
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        const text = await response.text();
        console.log('Raw response:', text);
        try {
            if (text) {
                const data = JSON.parse(text);
                console.log('Login Response:', data);
                return data.token;
            }
        } catch (parseError) {
            console.error('Failed to parse response:', parseError);
            console.log('Response text:', text);
        }
        return null;
    } catch (error) {
        console.error('Login Error:', error);
        return null;
    }
}

async function testLiveLottery(token) {
    try {
        console.log('Fetching live lottery data...');
        const response = await fetch(`${config.API_BASE_URL}/lottery/live.php`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        const text = await response.text();
        console.log('Raw response:', text);
        try {
            if (text) {
                const data = JSON.parse(text);
                console.log('Live Lottery Data:', data);
            }
        } catch (parseError) {
            console.error('Failed to parse response:', parseError);
            console.log('Response text:', text);
        }
    } catch (error) {
        console.error('Live Lottery Error:', error);
    }
}

async function testTransactionHistory(token) {
    try {
        console.log('Fetching transaction history...');
        const response = await fetch(`${config.API_BASE_URL}/transaction/history.php`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        const text = await response.text();
        console.log('Raw response:', text);
        try {
            if (text) {
                const data = JSON.parse(text);
                console.log('Transaction History:', data);
            }
        } catch (parseError) {
            console.error('Failed to parse response:', parseError);
            console.log('Response text:', text);
        }
    } catch (error) {
        console.error('Transaction History Error:', error);
    }
}

async function runTests() {
    console.log('Starting API Tests...');
    console.log('API URL:', config.API_URL);
    console.log('API Base URL:', config.API_BASE_URL);
    
    const registered = await testRegister();
    console.log('Registration result:', registered);
    
    if (registered) {
        const token = await testLogin();
        console.log('Login token:', token);
        
        if (token) {
            await testLiveLottery(token);
            await testTransactionHistory(token);
        }
    }
    console.log('Tests completed.');
}

runTests(); 