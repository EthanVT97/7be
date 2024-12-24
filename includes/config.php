<?php
// Database configuration
define('DB_HOST', 'sql12.freesqldatabase.com');
define('DB_USER', 'sql12753941');
define('DB_PASS', 'xPMZuuk5AZ');
define('DB_NAME', 'sql12753941');

// Establish database connection
try {
    $conn = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}

// Time zone setting
date_default_timezone_set('Asia/Yangon');

// Application constants
define('SITE_NAME', '2D3D Kobo');
define('BASE_URL', 'http://localhost/2D3DKobo');

// Session start
session_start();

// User roles
define('ROLE_USER', 'user');
define('ROLE_ADMIN', 'admin');

// Lottery types
define('LOTTERY_2D', '2D');
define('LOTTERY_3D', '3D');
define('LOTTERY_THAI', 'THAI');
define('LOTTERY_LAOS', 'LAOS');
?>
