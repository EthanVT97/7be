<?php
require_once __DIR__ . '/../../../vendor/autoload.php';

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: ' . (getenv('CORS_ORIGIN') ?: '*'));
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// Simple response matching current live endpoint
$response = [
    'status' => 'API is running'
];

http_response_code(200);
echo json_encode($response); 