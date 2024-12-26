<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../includes/config.php';

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

// Helper function for consistent responses
function sendResponse($data, $status = 'success', $code = 200) {
    http_response_code($code);
    echo json_encode([
        'status' => $status,
        'timestamp' => date('Y-m-d H:i:s'),
        'data' => $data
    ]);
    exit();
}

// Helper function for error responses
function sendError($message, $code = 400) {
    http_response_code($code);
    echo json_encode([
        'status' => 'error',
        'timestamp' => date('Y-m-d H:i:s'),
        'error' => $message
    ]);
    exit();
}

try {
    // Get the request URI and method
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $method = $_SERVER['REQUEST_METHOD'];

    // Basic routing
    switch ($uri) {
        case '/':
            sendResponse([
                'name' => '2D3D Lottery API',
                'version' => '1.0.0',
                'environment' => getenv('APP_ENV') ?: 'production',
                'endpoints' => [
                    'health' => '/health',
                    '2d_latest' => '/api/2d/latest',
                    '3d_latest' => '/api/3d/latest'
                ]
            ]);
            break;

        case '/health':
            try {
                // Test database connection
                $stmt = $conn->query('SELECT version()');
                $dbVersion = $stmt->fetchColumn();

                // Get connection stats
                $stmt = $conn->query('SELECT count(*) FROM pg_stat_activity');
                $activeConnections = $stmt->fetchColumn();

                sendResponse([
                    'database' => [
                        'status' => 'connected',
                        'version' => $dbVersion,
                        'active_connections' => (int)$activeConnections,
                        'host' => DB_HOST
                    ],
                    'memory' => [
                        'usage' => memory_get_usage(true),
                        'peak' => memory_get_peak_usage(true)
                    ],
                    'server' => [
                        'php_version' => PHP_VERSION,
                        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'PHP Built-in Server'
                    ]
                ]);
            } catch (Exception $e) {
                sendError('Database connection failed: ' . $e->getMessage(), 500);
            }
            break;

        case '/api/2d/latest':
            if ($method !== 'GET') {
                sendError('Method not allowed', 405);
            }
            
            sendResponse([
                'date' => date('Y-m-d'),
                'time' => '4:30 PM',
                'number' => '12',
                'set' => date('l'), // Day of the week
                'next_draw' => date('Y-m-d', strtotime('+1 day')) . ' 4:30 PM'
            ]);
            break;

        case '/api/3d/latest':
            if ($method !== 'GET') {
                sendError('Method not allowed', 405);
            }
            
            sendResponse([
                'date' => date('Y-m-d'),
                'number' => '123',
                'set' => date('F'), // Month name
                'next_draw' => date('Y-m-d', strtotime('+1 month')) . ' 5:00 PM'
            ]);
            break;

        case '/favicon.ico':
            http_response_code(204); // No content
            break;

        default:
            sendError('Endpoint not found: ' . $uri, 404);
            break;
    }
} catch (Exception $e) {
    error_log("Error: " . $e->getMessage());
    sendError('Internal Server Error: ' . $e->getMessage(), 500);
}
?>