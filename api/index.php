<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

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

// Get the action from query parameter
$route = $_GET['action'] ?? '';
$subaction = $_GET['subaction'] ?? '';

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

    // Handle different routes
    switch ($route) {
        case 'results':
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
            $response = [
                'status' => 'success',
                'message' => 'API is running',
                'server_time' => date('Y-m-d H:i:s'),
                'timezone' => date_default_timezone_get(),
                'db_connected' => true,
                'db_host' => DB_HOST
            ];
            break;

        default:
            $response = [
                'status' => 'error',
                'message' => 'Invalid route',
                'available_routes' => [
                    '/api/?action=results',
                    '/api/?action=results&subaction=latest',
                    '/api/?action=status'
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

// Send response
echo json_encode($response);
