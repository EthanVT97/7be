<?php
// Enable error reporting
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Database credentials
$db_host = 'sql207.infinityfree.com';
$db_name = 'if0_37960691_if0_37960691_lottery';
$db_user = 'if0_37960691';
$db_pass = 'j7Mw1ZKMjPD';

try {
    // Create PDO connection
    $pdo = new PDO(
        "mysql:host=$db_host;dbname=$db_name",
        $db_user,
        $db_pass,
        array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION)
    );
    
    echo "Database connection successful!";
    
    // Test query
    $stmt = $pdo->query("SELECT NOW()");
    $result = $stmt->fetch(PDO::FETCH_COLUMN);
    echo "\nCurrent database time: " . $result;
    
} catch (PDOException $e) {
    echo "Database connection failed: " . $e->getMessage();
}
