<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Debug logging
error_log("=== API Request Start ===");
error_log("Method: " . $_SERVER['REQUEST_METHOD']);
error_log("URI: " . $_SERVER['REQUEST_URI']);
error_log("Query String: " . ($_SERVER['QUERY_STRING'] ?? 'none'));
error_log("Script: " . $_SERVER['SCRIPT_NAME']);
error_log("GET params: " . json_encode($_GET));

// Handle CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('HTTP/1.1 200 OK');
    exit();
}

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Define constants
define('INCLUDED_FROM_INDEX', true);
define('API_REQUEST', true);

// Include configuration
require_once __DIR__ . '/../includes/config.php';

// Parse request
$parts = parse_url($_SERVER['REQUEST_URI']);
$path = $parts['path'] ?? '';
$query = [];
parse_str($parts['query'] ?? '', $query);

// Get action from either query string or path
$action = $query['action'] ?? '';
$subaction = $query['subaction'] ?? '';

error_log("Parsed action: " . $action);
error_log("Parsed subaction: " . $subaction);

// Initialize response
$response = ['status' => 'error', 'message' => 'Invalid request'];

try {
    // Test database connection
    if (!isset($conn)) {
        $conn = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
            DB_USER,
            DB_PASS,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
    }

    error_log("Database connected successfully");
    error_log("Processing route: " . $action);

    // Handle different routes
    switch ($action) {
        case 'results':
            error_log("Handling results route");
            if ($subaction === 'latest') {
                $stmt = $conn->query("SELECT * FROM lottery_results ORDER BY draw_date DESC, draw_time DESC LIMIT 1");
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($result) {
                    $response = [
                        'status' => 'success',
                        'data' => $result
                    ];
                } else {
                    $response = [
                        'status' => 'error',
                        'message' => 'No results found'
                    ];
                }
            } else {
                $stmt = $conn->query("SELECT * FROM lottery_results ORDER BY draw_date DESC, draw_time DESC LIMIT 10");
                $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $response = [
                    'status' => 'success',
                    'data' => $results
                ];
            }
            break;

        case 'status':
            error_log("Handling status route");
            $response = [
                'status' => 'success',
                'message' => 'API is working',
                'server_time' => date('Y-m-d H:i:s'),
                'timezone' => date_default_timezone_get(),
                'db_connected' => true,
                'db_host' => DB_HOST,
                'version' => '1.0.0',
                'debug' => [
                    'method' => $_SERVER['REQUEST_METHOD'],
                    'uri' => $_SERVER['REQUEST_URI'],
                    'query' => $_SERVER['QUERY_STRING'] ?? '',
                    'script' => $_SERVER['SCRIPT_NAME'],
                    'action' => $action,
                    'subaction' => $subaction
                ]
            ];
            break;

        case '':
            error_log("Handling root route");
            $response = [
                'status' => 'success',
                'message' => 'API is working',
                'server_time' => date('Y-m-d H:i:s'),
                'php_version' => PHP_VERSION,
                'request_method' => $_SERVER['REQUEST_METHOD'],
                'request_uri' => $_SERVER['REQUEST_URI'],
                'db_connected' => true
            ];
            break;

        default:
            error_log("Invalid route: " . $action);
            $response = [
                'status' => 'error',
                'message' => 'Invalid route',
                'available_routes' => [
                    '/api/?action=results',
                    '/api/?action=results&subaction=latest',
                    '/api/?action=status'
                ],
                'debug' => [
                    'requested_action' => $action,
                    'uri' => $_SERVER['REQUEST_URI'],
                    'query' => $_SERVER['QUERY_STRING'] ?? ''
                ]
            ];
    }
} catch (PDOException $e) {
    error_log("Database Error: " . $e->getMessage());
    $response = [
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage(),
        'debug' => [
            'host' => DB_HOST,
            'database' => DB_NAME
        ]
    ];
} catch (Exception $e) {
    error_log("Server Error: " . $e->getMessage());
    $response = [
        'status' => 'error',
        'message' => 'Server error: ' . $e->getMessage()
    ];
}

error_log("=== Final Response ===");
error_log(json_encode($response));

// Send response
echo json_encode($response);
