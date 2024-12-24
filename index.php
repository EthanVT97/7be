<?php
// Enable error reporting
ini_set('display_errors', 1);
error_reporting(E_ALL);

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
    // Basic response
    $response = [
        'status' => 'success',
        'message' => 'API is working',
        'server_time' => date('Y-m-d H:i:s'),
        'php_version' => PHP_VERSION,
        'request_method' => $_SERVER['REQUEST_METHOD'],
        'request_uri' => $_SERVER['REQUEST_URI']
    ];
    
    echo json_encode($response);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Server Error',
        'debug' => $e->getMessage()
    ]);
}
