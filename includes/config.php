<?php
// Database configuration
define('DB_HOST', getenv('DB_HOST') ?: 'sql12.freesqldatabase.com');
define('DB_USER', getenv('DB_USER') ?: 'sql12753941');
define('DB_PASS', getenv('DB_PASS') ?: 'xPMZuuk5AZ');
define('DB_NAME', getenv('DB_NAME') ?: 'sql12753941');

// Establish database connection
try {
    $conn = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch(PDOException $e) {
    error_log("Database Connection Error: " . $e->getMessage());
    if (!defined('API_REQUEST')) {
        echo "Connection failed: " . $e->getMessage();
    }
}

// Time zone setting
date_default_timezone_set('Asia/Yangon');

// Application constants
define('SITE_NAME', '2D3D Kobo');
define('BASE_URL', 'https://twod3d-lottery-api.onrender.com');

// Session start
if (!defined('API_REQUEST')) {
    session_start();
}

// User roles
define('ROLE_USER', 'user');
define('ROLE_ADMIN', 'admin');

// Lottery types
define('LOTTERY_2D', '2D');
define('LOTTERY_3D', '3D');
define('LOTTERY_THAI', 'THAI');
define('LOTTERY_LAOS', 'LAOS');
?>
