<?php
require_once '../config.php';

try {
    // Attempt to connect to database
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
        DB_USER,
        DB_PASS
    );
    
    // Set error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Connected successfully to the database!<br>";
    echo "Server info: " . $pdo->getAttribute(PDO::ATTR_SERVER_INFO) . "<br>";
    echo "Server version: " . $pdo->getAttribute(PDO::ATTR_SERVER_VERSION) . "<br>";
    
    // Test query
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    if (count($tables) > 0) {
        echo "<br>Existing tables in database:<br>";
        foreach ($tables as $table) {
            echo "- $table<br>";
        }
    } else {
        echo "<br>No tables found in database. Ready to create tables.<br>";
    }
    
} catch(PDOException $e) {
    echo "<h2>Connection failed</h2>";
    echo "Error: " . $e->getMessage() . "<br>";
    echo "<h3>Debug Information:</h3>";
    echo "Host: " . DB_HOST . "<br>";
    echo "Database: " . DB_NAME . "<br>";
    echo "Username: " . DB_USER . "<br>";
}
