<?php
require_once __DIR__ . '/../includes/jwt.php';

// Test data
$testPayload = [
    'user_id' => 123,
    'username' => 'testuser',
    'role' => 'user'
];

try {
    // Test 1: Generate Token
    echo "Test 1: Generating JWT Token...\n";
    $token = JWT::generate($testPayload);
    echo "✓ Token generated successfully: " . substr($token, 0, 20) . "...\n\n";

    // Test 2: Verify Token
    echo "Test 2: Verifying JWT Token...\n";
    $decoded = JWT::verify($token);
    if ($decoded) {
        echo "✓ Token verified successfully\n";
        echo "✓ Payload contains:\n";
        print_r($decoded);
    } else {
        throw new Exception("Token verification failed");
    }

    // Test 3: Check Expiry
    echo "\nTest 3: Checking expiry...\n";
    if (isset($decoded['exp'])) {
        $timeLeft = $decoded['exp'] - time();
        echo "✓ Token expires in: " . $timeLeft . " seconds\n";
    }

    // Test 4: Invalid Token
    echo "\nTest 4: Testing invalid token...\n";
    $invalidToken = $token . "invalid";
    $result = JWT::verify($invalidToken);
    if ($result === false) {
        echo "✓ Invalid token rejected successfully\n";
    }
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
    exit(1);
}
