<?php
require_once 'cors.php';

// Load environment variables
$envFile = __DIR__ . '/../.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            list($key, $value) = explode('=', $line, 2);
            $_ENV[trim($key)] = trim($value);
            putenv(trim($key) . '=' . trim($value));
        }
    }
}

// Secure JWT configuration
define('JWT_SECRET', getenv('JWT_SECRET') ?: throw new Exception('JWT_SECRET not set'));
define('JWT_EXPIRY', 60 * 60 * 24); // 24 hours
define('JWT_ALGORITHM', 'HS256');

// Database connection
try {
    $conn = new PDO(
        "mysql:host=" . getenv('DB_HOST') . ";dbname=" . getenv('DB_NAME'),
        getenv('DB_USER'),
        getenv('DB_PASS'),
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
        ]
    );
} catch (PDOException $e) {
    error_log('Connection failed: ' . $e->getMessage());
    http_response_code(500);
    die('Database connection failed');
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
