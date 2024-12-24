<?php
// Database configuration
define('DB_HOST', 'sql207.infinityfree.com');  // InfinityFree MySQL host
define('DB_NAME', 'if0_37960691_if0_37960691_lottery');     // Your database name
define('DB_USER', 'if0_37960691');            // Your InfinityFree username
define('DB_PASS', 'j7Mw1ZKMjPD');             // Your InfinityFree password

// Error reporting for development
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Session configuration
session_start();

// Timezone setting
date_default_timezone_set('Asia/Yangon');

// CORS Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
