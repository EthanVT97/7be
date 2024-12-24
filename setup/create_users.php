<?php
try {
    $conn = new PDO(
        "mysql:host=sql12.freesqldatabase.com;dbname=sql12753941",
        "sql12753941",
        "xPMZuuk5AZ"
    );
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create users table
    $sql = "CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) UNIQUE,
        phone VARCHAR(20),
        balance DECIMAL(10,2) DEFAULT 0.00,
        role ENUM('user', 'admin') DEFAULT 'user',
        status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
        last_login DATETIME NULL,
        created_at DATETIME NULL,
        updated_at DATETIME NULL
    )";
    $conn->exec($sql);
    echo "Users table created successfully\n";

    // Check if admin user exists
    $sql = "SELECT COUNT(*) FROM users WHERE username = 'admin'";
    $stmt = $conn->query($sql);
    $count = $stmt->fetchColumn();

    if ($count == 0) {
        // Create default admin user
        $sql = "INSERT INTO users (username, password, email, role, created_at, updated_at) 
                VALUES ('admin', ?, 'admin@2d3dkobo.com', 'admin', NOW(), NOW())";
        $stmt = $conn->prepare($sql);
        $password_hash = password_hash('admin123', PASSWORD_DEFAULT);
        $stmt->execute([$password_hash]);
        echo "Default admin user created successfully\n";
    } else {
        echo "Admin user already exists\n";
    }
    
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
