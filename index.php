<?php
// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

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
    // Load configuration
    require_once __DIR__ . '/config.php';
    
    // Initialize response
    $response = ['status' => 'success', 'message' => 'API is working'];
    
    // Get request path
    $request_uri = $_SERVER['REQUEST_URI'];
    $path = trim(parse_url($request_uri, PHP_URL_PATH), '/');
    $segments = explode('/', $path);
    $route = $segments[0] ?? '';

    // Basic route handling
    switch ($route) {
        case '':
        case 'home':
            $response = [
                'status' => 'success',
                'data' => [
                    'message' => 'Welcome to 2D3D Kobo API',
                    'version' => '1.0.0'
                ]
            ];
            break;

        case 'test':
            $response = [
                'status' => 'success',
                'data' => [
                    'message' => 'API test endpoint',
                    'time' => date('Y-m-d H:i:s'),
                    'route' => $route
                ]
            ];
            break;

        default:
            http_response_code(404);
            $response = [
                'status' => 'error',
                'message' => 'Route not found'
            ];
            break;
    }

} catch (Exception $e) {
    http_response_code(500);
    $response = [
        'status' => 'error',
        'message' => 'Server Error',
        'debug' => $e->getMessage()
    ];
}

// Send response
echo json_encode($response);
exit();
