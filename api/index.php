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
error_log("GET params raw: " . print_r($_GET, true));
error_log("Server variables: " . print_r($_SERVER, true));

// Handle CORS
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Define constants
define('INCLUDED_FROM_INDEX', true);
define('API_REQUEST', true);

// Include configuration
require_once __DIR__ . '/../includes/config.php';

// Get action and subaction directly from query string
$query_string = $_SERVER['QUERY_STRING'] ?? '';
parse_str($query_string, $query_params);
$action = isset($query_params['action']) ? trim($query_params['action']) : '';
$subaction = isset($query_params['subaction']) ? trim($query_params['subaction']) : '';

error_log("Query string parsed: " . print_r($query_params, true));
error_log("Action (parsed): " . $action);
error_log("Subaction: " . $subaction);

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
                'version' => '1.0.0',
                'debug' => [
                    'method' => $_SERVER['REQUEST_METHOD'],
                    'uri' => $_SERVER['REQUEST_URI'],
                    'query_string' => $query_string,
                    'query_params' => $query_params,
                    'action' => $action,
                    'subaction' => $subaction,
                    'get_params' => $_GET,
                    'script_name' => $_SERVER['SCRIPT_NAME'],
                    'request_uri' => $_SERVER['REQUEST_URI'],
                    'php_self' => $_SERVER['PHP_SELF']
                ]
            ];
            break;

        case '':
            error_log("Handling root route");
            $response = [
                'status' => 'success',
                'message' => 'Welcome to 2D3D Lottery API',
                'version' => '1.0.0',
                'endpoints' => [
                    '/api/?action=status',
                    '/api/?action=results',
                    '/api/?action=results&subaction=latest'
                ],
                'debug' => [
                    'method' => $_SERVER['REQUEST_METHOD'],
                    'uri' => $_SERVER['REQUEST_URI'],
                    'query_string' => $query_string,
                    'get_params' => $_GET
                ]
            ];
            break;

        default:
            error_log("Invalid route (default case): " . $action);
            throw new Exception("Invalid action: " . $action);
    }
} catch (PDOException $e) {
    error_log("Database Error: " . $e->getMessage());
    $response = [
        'status' => 'error',
        'message' => 'Database error',
        'debug' => [
            'error' => $e->getMessage(),
            'host' => DB_HOST,
            'database' => DB_NAME,
            'query_string' => $query_string,
            'action' => $action
        ]
    ];
} catch (Exception $e) {
    error_log("Server Error: " . $e->getMessage());
    $response = [
        'status' => 'error',
        'message' => $e->getMessage(),
        'debug' => [
            'query_string' => $query_string,
            'action' => $action,
            'uri' => $_SERVER['REQUEST_URI']
        ]
    ];
}

error_log("=== Final Response ===");
error_log(json_encode($response));

// Send response
echo json_encode($response);
