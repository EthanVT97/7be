<?php
try {
    $conn = new PDO(
        "mysql:host=sql12.freesqldatabase.com;dbname=sql12753941",
        "sql12753941",
        "xPMZuuk5AZ"
    );
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
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
    
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
