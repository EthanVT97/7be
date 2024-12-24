<?php
require_once __DIR__ . '/../includes/config.php';

try {
    $stmt = $conn->prepare("SELECT id, username, email, role FROM users WHERE username = ?");
    $stmt->execute(['test']);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        echo "User found:\n";
        print_r($user);
    } else {
        echo "User 'test' not found\n";
        
        // Try to create the user
        $password = password_hash('test123', PASSWORD_DEFAULT);
        $stmt = $conn->prepare("INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, 'admin')");
        $stmt->execute(['test', $password, 'test@example.com']);
        echo "Created test user\n";
    }
} catch (PDOException $e) {
    echo "Database Error: " . $e->getMessage() . "\n";
}
