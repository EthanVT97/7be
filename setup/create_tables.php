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

    // Create lottery_results table
    $sql = "CREATE TABLE IF NOT EXISTS lottery_results (
        id INT AUTO_INCREMENT PRIMARY KEY,
        lottery_type VARCHAR(10) NOT NULL,
        draw_date DATE NOT NULL,
        draw_time TIME,
        result_number VARCHAR(20) NOT NULL,
        status ENUM('pending', 'confirmed') DEFAULT 'confirmed',
        created_at DATETIME NULL,
        updated_at DATETIME NULL,
        INDEX idx_lottery_date (lottery_type, draw_date, draw_time)
    )";
    $conn->exec($sql);
    echo "Lottery results table created successfully\n";

    // Create payments table
    $sql = "CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        payment_type ENUM('deposit', 'withdrawal') NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        transaction_id VARCHAR(100),
        proof_image VARCHAR(255),
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        remark TEXT,
        created_at DATETIME NULL,
        updated_at DATETIME NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
        INDEX idx_user_status (user_id, status)
    )";
    $conn->exec($sql);
    echo "Payments table created successfully\n";

    // Create notifications table
    $sql = "CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type ENUM('system', 'payment', 'result', 'custom') NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at DATETIME NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_read (user_id, is_read)
    )";
    $conn->exec($sql);
    echo "Notifications table created successfully\n";

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
