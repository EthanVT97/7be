<?php
try {
    $conn = new PDO(
        "mysql:host=sql12.freesqldatabase.com;dbname=sql12753941",
        "sql12753941",
        "xPMZuuk5AZ"
    );
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
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
    
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
