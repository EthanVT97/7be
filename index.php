<?php
// Enable error reporting
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Define that this is included from index
define('INCLUDED_FROM_INDEX', true);

// Include configuration
require_once __DIR__ . '/config.php';

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Test database connection
    $conn = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    // Basic response
    $response = [
        'status' => 'success',
        'message' => 'API is working',
        'server_time' => date('Y-m-d H:i:s'),
        'php_version' => PHP_VERSION,
        'request_method' => $_SERVER['REQUEST_METHOD'],
        'request_uri' => $_SERVER['REQUEST_URI'],
        'db_connected' => true
    ];
    
    echo json_encode($response);
} catch (PDOException $e) {
    error_log("Database Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database Connection Error',
        'debug' => $e->getMessage()
    ]);
} catch (Exception $e) {
    error_log("Server Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Server Error',
        'debug' => $e->getMessage()
    ]);
}
