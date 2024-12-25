<?php
// Database configuration
define('DB_HOST', 'sql12.freesqldatabase.com');
define('DB_NAME', 'sql12753941');
define('DB_USER', 'sql12753941');
define('DB_PASS', 'xPMZuuk5AZ');

// Site configuration
define('SITE_NAME', '2D3D Lottery');
define('SITE_URL', 'https://twod3d-lottery.onrender.com');

// Initialize database connection
try {
    $conn = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    error_log("Database Connection Error: " . $e->getMessage());
    die("Database connection failed");
}

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
