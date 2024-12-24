<?php
// Prevent direct access
if (!defined('INCLUDED_FROM_INDEX') && basename($_SERVER['PHP_SELF']) == basename(__FILE__)) {
    die('Direct access not permitted');
}

// Database configuration
define('DB_HOST', 'sql207.infinityfree.com');  // InfinityFree MySQL host
define('DB_NAME', 'if0_37960691_if0_37960691_lottery');     // Your database name
define('DB_USER', 'if0_37960691');            // Your InfinityFree username
define('DB_PASS', 'j7Mw1ZKMjPD');             // Your InfinityFree password

// Site configuration
define('SITE_NAME', '2D3D Kobo');
define('SITE_URL', 'https://twod3d-lottery-api.onrender.com');

// Session configuration
session_start();
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', 1);

// Timezone setting
date_default_timezone_set('Asia/Yangon');

// CORS Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/error.log');
