<?php
require_once __DIR__ . '/../includes/config.php';

try {
    // Get test user
    $stmt = $conn->prepare("SELECT id, username, password, role FROM users WHERE username = ?");
    $stmt->execute(['test']);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        echo "Test user not found\n";
        exit;
    }
    
    echo "Found test user:\n";
    echo "ID: " . $user['id'] . "\n";
    echo "Username: " . $user['username'] . "\n";
    echo "Role: " . $user['role'] . "\n";
    echo "Password hash: " . $user['password'] . "\n\n";
    
    // Test password verification
    $testPassword = 'test123';
    if (password_verify($testPassword, $user['password'])) {
        echo "Password verification successful!\n";
    } else {
        echo "Password verification failed!\n";
        
        // Create new password hash for comparison
        $newHash = password_hash($testPassword, PASSWORD_DEFAULT);
        echo "\nDebug info:\n";
        echo "Test password: " . $testPassword . "\n";
        echo "Stored hash: " . $user['password'] . "\n";
        echo "New hash: " . $newHash . "\n";
        
        // Update password
        echo "\nUpdating password...\n";
        $stmt = $conn->prepare("UPDATE users SET password = ? WHERE username = ?");
        $stmt->execute([$newHash, 'test']);
        echo "Password updated!\n";
    }
    
} catch (PDOException $e) {
    echo "Database Error: " . $e->getMessage() . "\n";
}
