<?php
// Enable error reporting for development
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Set headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Authentication handling
function getAuthToken() {
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        return str_replace('Bearer ', '', $headers['Authorization']);
    }
    return null;
}

function validateToken($token) {
    // TODO: Replace with your actual token validation logic
    // This is a simple example - you should use proper JWT validation
    $validTokens = ['your-secret-token-1', 'your-secret-token-2'];
    return in_array($token, $validTokens);
}

// Input validation
function validateInput($params) {
    $errors = [];
    
    // Validate action parameter
    if (!isset($params['action'])) {
        $errors[] = 'Action parameter is required';
    } else {
        $validActions = ['status', 'getResults', 'updateResults'];
        if (!in_array($params['action'], $validActions)) {
            $errors[] = 'Invalid action specified';
        }
    }
    
    // Validate date format if provided
    if (isset($params['date'])) {
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $params['date'])) {
            $errors[] = 'Invalid date format. Use YYYY-MM-DD';
        }
    }
    
    return $errors;
}

// Error response helper
function sendError($message, $code = 400) {
    http_response_code($code);
    echo json_encode([
        'status' => 'error',
        'message' => $message,
        'timestamp' => date('Y-m-d\TH:i:sP'),
        'code' => $code
    ]);
    exit();
}

// Success response helper
function sendSuccess($data, $message = 'Success') {
    echo json_encode([
        'status' => 'success',
        'message' => $message,
        'data' => $data,
        'timestamp' => date('Y-m-d\TH:i:sP'),
        'request' => [
            'uri' => $_SERVER['REQUEST_URI'],
            'method' => $_SERVER['REQUEST_METHOD'],
            'params' => $_GET
        ]
    ]);
    exit();
}

try {
    // Log request details
    error_log("Request URI: " . $_SERVER['REQUEST_URI']);
    error_log("Query String: " . $_SERVER['QUERY_STRING']);
    error_log("GET params: " . print_r($_GET, true));
    
    // Validate input
    $validationErrors = validateInput($_GET);
    if (!empty($validationErrors)) {
        sendError($validationErrors);
    }
    
    // Check authentication for protected endpoints
    $protectedActions = ['updateResults'];
    if (in_array($_GET['action'], $protectedActions)) {
        $token = getAuthToken();
        if (!$token) {
            sendError('Authentication token required', 401);
        }
        if (!validateToken($token)) {
            sendError('Invalid authentication token', 401);
        }
    }
    
    // Handle different actions
    switch ($_GET['action']) {
        case 'status':
            sendSuccess([
                'serverTime' => date('Y-m-d\TH:i:sP'),
                'status' => 'operational',
                'version' => '1.0.0'
            ]);
            break;
            
        case 'getResults':
            // TODO: Implement results retrieval logic
            sendSuccess([
                'results' => [],
                'lastUpdated' => date('Y-m-d\TH:i:sP')
            ]);
            break;
            
        case 'updateResults':
            // TODO: Implement results update logic
            sendSuccess([
                'updated' => true,
                'timestamp' => date('Y-m-d\TH:i:sP')
            ]);
            break;
            
        default:
            sendError('Invalid action specified');
    }
    
} catch (Exception $e) {
    error_log("API Error: " . $e->getMessage());
    sendError('Internal server error', 500);
}