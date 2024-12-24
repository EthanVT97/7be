<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Define constants
define('INCLUDED_FROM_INDEX', true);
define('API_REQUEST', true);

// Include configuration
require_once __DIR__ . '/../includes/config.php';

// Test database connection
try {
    $conn = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    
    $response = [
        'status' => 'success',
        'message' => 'Database connection successful',
        'server_time' => date('Y-m-d H:i:s'),
        'timezone' => date_default_timezone_get(),
        'db_host' => DB_HOST,
        'db_name' => DB_NAME,
        'php_version' => PHP_VERSION,
        'debug' => [
            'request_method' => $_SERVER['REQUEST_METHOD'],
            'request_uri' => $_SERVER['REQUEST_URI'],
            'query_string' => $_SERVER['QUERY_STRING'] ?? '',
            'script_name' => $_SERVER['SCRIPT_NAME']
        ]
    ];
} catch (PDOException $e) {
    $response = [
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage(),
        'debug' => [
            'host' => DB_HOST,
            'database' => DB_NAME,
            'request_method' => $_SERVER['REQUEST_METHOD'],
            'request_uri' => $_SERVER['REQUEST_URI'],
            'query_string' => $_SERVER['QUERY_STRING'] ?? '',
            'script_name' => $_SERVER['SCRIPT_NAME']
        ]
    ];
}

// Debug logging
error_log("Test Endpoint - Method: " . $_SERVER['REQUEST_METHOD'] . ", URI: " . $_SERVER['REQUEST_URI']);
error_log("Test Response: " . json_encode($response));

// Send response
header('Content-Type: application/json');
echo json_encode($response);
