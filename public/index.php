<?php
require_once __DIR__ . '/../vendor/autoload.php';

// Error handling
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/error.log');

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, Accept, Origin, X-Requested-With');
header('Access-Control-Max-Age: 86400');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Route handling will go here
    echo json_encode([
        'status' => 'success',
        'message' => 'API is running',
        'version' => '1.0.0',
        'timestamp' => date('Y-m-d H:i:s'),
        'environment' => getenv('APP_ENV') ?: 'production'
    ]);
} catch (Exception $e) {
    error_log("Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Internal Server Error',
        'error' => $e->getMessage()
    ]);
}
?>