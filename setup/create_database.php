<?php
try {
    $pdo = new PDO(
        "mysql:host=localhost",
        "root",
        ""
    );
    
    // Create database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS 7k_online");
    echo "Database created successfully\n";
    
    // Select database
    $pdo->exec("USE 7k_online");
    
    // Create users table
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(20),
        balance DECIMAL(10,2) DEFAULT 0.00,
        role ENUM('user', 'admin') DEFAULT 'user',
        status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
        last_login DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    echo "Users table created successfully\n";
    
    // Create test user
    $username = 'test';
    $password = password_hash('test123', PASSWORD_DEFAULT);
    $email = 'test@example.com';
    
    try {
        $stmt = $pdo->prepare("INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, 'admin')");
        $stmt->execute([$username, $password, $email]);
        echo "Test user created successfully\n";
    } catch (PDOException $e) {
        if ($e->getCode() != 23000) { // Skip if user already exists
            throw $e;
        }
        echo "Test user already exists\n";
    }
    
} catch(PDOException $e) {
    die("Database Error: " . $e->getMessage() . "\n");
}
