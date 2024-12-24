<?php
try {
    $conn = new PDO(
        "mysql:host=sql12.freesqldatabase.com;dbname=sql12753941",
        "sql12753941",
        "xPMZuuk5AZ"
    );
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
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
    
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
