<?php
$API_BASE_URL = 'http://18kchat.42web.io/api';

function testEndpoint($action, $subaction = '', $method = 'GET', $data = null) {
    global $API_BASE_URL;
    $url = $API_BASE_URL . '/index.php?action=' . $action;
    if ($subaction) {
        $url .= '&subaction=' . $subaction;
    }
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    return [
        'status' => $httpCode,
        'response' => json_decode($response, true),
        'error' => $error
    ];
}

echo "<h2>API Endpoint Tests</h2>";

// 1. Test Registration
echo "<h3>1. Testing Registration</h3>";
$registrationData = [
    'username' => 'testuser' . time(),
    'email' => 'testuser' . time() . '@example.com',
    'password' => 'test123'
];
$result = testEndpoint('register', '', 'POST', $registrationData);
echo "Registration Status: " . $result['status'] . "<br>";
echo "Response: <pre>" . print_r($result['response'], true) . "</pre>";
if ($result['error']) echo "Error: " . $result['error'] . "<br>";
echo "<hr>";

// 2. Test Login
echo "<h3>2. Testing Login</h3>";
$loginData = [
    'username' => $registrationData['username'],
    'password' => 'test123'
];
$result = testEndpoint('login', '', 'POST', $loginData);
echo "Login Status: " . $result['status'] . "<br>";
echo "Response: <pre>" . print_r($result['response'], true) . "</pre>";
if ($result['error']) echo "Error: " . $result['error'] . "<br>";
echo "<hr>";

// 3. Test Live Results
echo "<h3>3. Testing Live Results</h3>";
$result = testEndpoint('results', 'live');
echo "Live Results Status: " . $result['status'] . "<br>";
echo "Response: <pre>" . print_r($result['response'], true) . "</pre>";
if ($result['error']) echo "Error: " . $result['error'] . "<br>";
echo "<hr>";

// 4. Test Pages
echo "<h3>4. Testing Pages</h3>";
$pages = ['home', '2d', '3d', 'thai', 'laos'];
foreach ($pages as $page) {
    $result = testEndpoint('pages', $page);
    echo "Page '$page' Status: " . $result['status'] . "<br>";
    echo "Response: <pre>" . print_r($result['response'], true) . "</pre>";
    if ($result['error']) echo "Error: " . $result['error'] . "<br>";
    echo "<hr>";
}
