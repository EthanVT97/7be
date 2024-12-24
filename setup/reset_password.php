<?php
require_once __DIR__ . '/../includes/config.php';

try {
    // Update test user's password
    $password = password_hash('test123', PASSWORD_DEFAULT);
    $stmt = $conn->prepare("UPDATE users SET password = ? WHERE username = ?");
    $stmt->execute([$password, 'test']);
    echo "Password updated for test user\n";
    
    // Verify the password
    $stmt = $conn->prepare("SELECT id, username, password FROM users WHERE username = ?");
    $stmt->execute(['test']);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (password_verify('test123', $user['password'])) {
        echo "Password verification successful\n";
    } else {
        echo "Password verification failed\n";
    }
    
} catch (PDOException $e) {
    echo "Database Error: " . $e->getMessage() . "\n";
}
