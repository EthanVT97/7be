<?php
// Set CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set error handler
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    error_log("API Error ($errno): $errstr in $errfile on line $errline");
});

require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/LotteryResultsFetcher.php';
require_once __DIR__ . '/../includes/JWTAuth.php';
require_once __DIR__ . '/../includes/RateLimiter.php';
require_once __DIR__ . '/../includes/RequestLogger.php';
require_once __DIR__ . '/../includes/CacheManager.php';

// Initialize components
$auth = new JWTAuth();
$rateLimiter = new RateLimiter(60, 60); // 60 requests per minute
$logger = new RequestLogger($conn);
$cache = new CacheManager();
$requestStart = microtime(true);

// Set headers
header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate');

// Response helpers
function sendResponse($data, $status = 'success', $message = '', $code = 200) {
    global $requestStart, $logger;
    $duration = (microtime(true) - $requestStart) * 1000;
    
    $response = [
        'status' => $status,
        'message' => $message,
        'data' => $data,
        'timestamp' => date('Y-m-d\TH:i:sP')
    ];
    
    http_response_code($code);
    $logger->log($_REQUEST, $response, $duration);
    echo json_encode($response);
    exit;
}

function sendError($message, $code = 400) {
    sendResponse(null, 'error', $message, $code);
}

// Check rate limit
$clientIp = $_SERVER['REMOTE_ADDR'];
if (!$rateLimiter->checkLimit($clientIp)) {
    sendError('Rate limit exceeded', 429);
}

// Parse the request URI
$requestUri = $_SERVER['REQUEST_URI'];
$basePath = '/api';
$path = str_replace($basePath, '', parse_url($requestUri, PHP_URL_PATH));
$pathParts = array_values(array_filter(explode('/', $path)));

error_log("API Request: " . $_SERVER['REQUEST_METHOD'] . " " . $requestUri);
error_log("Path parts: " . print_r($pathParts, true));

// Root endpoint - Status check
if (empty($pathParts)) {
    sendResponse([
        'server_time' => date('Y-m-d H:i:s'),
        'php_version' => PHP_VERSION,
        'request_method' => $_SERVER['REQUEST_METHOD'],
        'request_uri' => $_SERVER['REQUEST_URI'],
        'db_connected' => isset($conn),
        'rate_limit_remaining' => $rateLimiter->getRemainingLimit($clientIp)
    ], 'success', 'API is working');
}

// Handle lottery results endpoint
if ($pathParts[0] === 'lottery' && $pathParts[1] === 'results') {
    try {
        // Get latest results from database
        $stmt = $conn->prepare("
            SELECT * FROM lottery_results 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
            ORDER BY created_at DESC 
            LIMIT 10
        ");
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // If no results, return empty array
        if (empty($results)) {
            sendResponse([
                'latest' => [],
                'updated_at' => date('Y-m-d H:i:s')
            ]);
        }
        
        sendResponse([
            'latest' => $results,
            'updated_at' => date('Y-m-d H:i:s')
        ]);
    } catch (PDOException $e) {
        error_log("Database Error: " . $e->getMessage());
        sendError('Failed to fetch lottery results', 500);
    }
}

// Handle authentication endpoints
if (isset($pathParts[0]) && $pathParts[0] === 'auth') {
    switch ($pathParts[1] ?? '') {
        case 'login':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendError('Method not allowed', 405);
            }
            
            // Get raw request body
            $rawInput = file_get_contents('php://input');
            error_log("Raw login request body: " . $rawInput);
            
            // Parse JSON data
            $data = json_decode($rawInput, true);
            error_log("Parsed login data: " . print_r($data, true));
            
            // Validate required fields
            if (!isset($data['username']) || !isset($data['password'])) {
                error_log("Missing required fields. Data received: " . print_r($data, true));
                sendError('Username and password are required');
            }
            
            $username = trim($data['username']);
            $password = trim($data['password']);
            
            error_log("Login attempt - Username: " . $username . ", Password: " . $password);
            
            try {
                // Get user from database
                $stmt = $conn->prepare("SELECT id, username, password, role FROM users WHERE username = ?");
                $stmt->execute([$username]);
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
                
                error_log("User lookup result: " . print_r($user, true));
                
                // User not found
                if (!$user) {
                    error_log("User not found: " . $username);
                    sendError('Invalid username or password', 401);
                }
                
                // Debug password verification
                $isValid = password_verify($password, $user['password']);
                error_log("Password verification result: " . ($isValid ? "success" : "failed"));
                error_log("Input password: " . $password);
                error_log("Stored hash: " . $user['password']);
                
                if (!$isValid) {
                    sendError('Invalid username or password', 401);
                }
                
                // Generate token
                $token = $auth->generateToken($user['id'], $user['role']);
                error_log("Generated token for user " . $username . ": " . $token);
                
                // Send success response
                sendResponse([
                    'token' => $token,
                    'user' => [
                        'id' => $user['id'],
                        'username' => $user['username'],
                        'role' => $user['role']
                    ]
                ], 'success', 'Login successful');
                
            } catch (PDOException $e) {
                error_log("Database error during login: " . $e->getMessage());
                sendError('Login failed', 500);
            }
            break;
            
        default:
            sendError('Invalid auth endpoint', 404);
    }
    exit;
}

try {
    $resultsFetcher = new LotteryResultsFetcher($conn);
    
    // Handle 2D endpoints
    if (isset($pathParts[0]) && $pathParts[0] === '2d') {
        $cacheKey = "2d:" . ($pathParts[1] ?? '') . ":" . implode(":", array_slice($pathParts, 2));
        
        switch ($pathParts[1] ?? '') {
            case 'today':
                // Check cache first
                if ($cached = $cache->get($cacheKey)) {
                    sendResponse($cached);
                }
                
                $results = $resultsFetcher->getResults('2D', 1);
                $cache->set($cacheKey, $results, 300); // Cache for 5 minutes
                sendResponse($results);
                break;
                
            case 'latest':
                if ($cached = $cache->get($cacheKey)) {
                    sendResponse($cached);
                }
                
                $result = $resultsFetcher->getLatestResult('2D');
                $cache->set($cacheKey, $result, 300);
                sendResponse($result);
                break;
                
            case 'date':
                if (!isset($pathParts[2])) {
                    sendError('Date parameter is required');
                }
                
                if ($cached = $cache->get($cacheKey)) {
                    sendResponse($cached);
                }
                
                $results = $resultsFetcher->getResultsByDateRange('2D', $pathParts[2], $pathParts[2]);
                $cache->set($cacheKey, $results, 3600); // Cache for 1 hour
                sendResponse($results);
                break;
                
            case 'history':
                $limit = $_GET['limit'] ?? 10;
                $cacheKey .= ":$limit";
                
                if ($cached = $cache->get($cacheKey)) {
                    sendResponse($cached);
                }
                
                $results = $resultsFetcher->getResults('2D', $limit);
                $cache->set($cacheKey, $results, 1800); // Cache for 30 minutes
                sendResponse($results);
                break;
                
            case 'update':
                if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                    sendError('Method not allowed', 405);
                }
                
                // Validate JWT token
                $token = str_replace('Bearer ', '', $_SERVER['HTTP_AUTHORIZATION'] ?? '');
                $payload = $auth->validateToken($token);
                if (!$payload || $payload['role'] !== 'admin') {
                    sendError('Unauthorized', 401);
                }
                
                $data = json_decode(file_get_contents('php://input'), true);
                if (!$data || !isset($data['number']) || !isset($data['date'])) {
                    sendError('Invalid request data');
                }
                
                // Update the result
                $stmt = $conn->prepare(
                    "INSERT INTO lottery_results (lottery_type, number, draw_date, draw_time)
                    VALUES ('2D', :number, :date, :time)
                    ON DUPLICATE KEY UPDATE
                    number = VALUES(number)"
                );
                
                $stmt->execute([
                    ':number' => $data['number'],
                    ':date' => $data['date'],
                    ':time' => $data['time'] ?? date('H:i:s')
                ]);
                
                // Clear related caches
                $cache->delete('2d:today');
                $cache->delete('2d:latest');
                $cache->delete("2d:date:{$data['date']}");
                
                sendResponse(['updated' => true]);
                break;
                
            default:
                sendError('Invalid endpoint', 404);
        }
    }
    
    // Handle 3D endpoints (similar to 2D with different cache keys)
    else if (isset($pathParts[0]) && $pathParts[0] === '3d') {
        $cacheKey = "3d:" . ($pathParts[1] ?? '') . ":" . implode(":", array_slice($pathParts, 2));
        
        switch ($pathParts[1] ?? '') {
            case 'today':
                if ($cached = $cache->get($cacheKey)) {
                    sendResponse($cached);
                }
                
                $results = $resultsFetcher->getResults('3D', 1);
                $cache->set($cacheKey, $results, 300);
                sendResponse($results);
                break;
                
            case 'latest':
                if ($cached = $cache->get($cacheKey)) {
                    sendResponse($cached);
                }
                
                $result = $resultsFetcher->getLatestResult('3D');
                $cache->set($cacheKey, $result, 300);
                sendResponse($result);
                break;
                
            case 'date':
                if (!isset($pathParts[2])) {
                    sendError('Date parameter is required');
                }
                
                if ($cached = $cache->get($cacheKey)) {
                    sendResponse($cached);
                }
                
                $results = $resultsFetcher->getResultsByDateRange('3D', $pathParts[2], $pathParts[2]);
                $cache->set($cacheKey, $results, 3600);
                sendResponse($results);
                break;
                
            case 'history':
                $limit = $_GET['limit'] ?? 10;
                $cacheKey .= ":$limit";
                
                if ($cached = $cache->get($cacheKey)) {
                    sendResponse($cached);
                }
                
                $results = $resultsFetcher->getResults('3D', $limit);
                $cache->set($cacheKey, $results, 1800);
                sendResponse($results);
                break;
                
            case 'update':
                if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                    sendError('Method not allowed', 405);
                }
                
                // Validate JWT token
                $token = str_replace('Bearer ', '', $_SERVER['HTTP_AUTHORIZATION'] ?? '');
                $payload = $auth->validateToken($token);
                if (!$payload || $payload['role'] !== 'admin') {
                    sendError('Unauthorized', 401);
                }
                
                $data = json_decode(file_get_contents('php://input'), true);
                if (!$data || !isset($data['number']) || !isset($data['date'])) {
                    sendError('Invalid request data');
                }
                
                // Update the result
                $stmt = $conn->prepare(
                    "INSERT INTO lottery_results (lottery_type, number, draw_date, draw_time)
                    VALUES ('3D', :number, :date, :time)
                    ON DUPLICATE KEY UPDATE
                    number = VALUES(number)"
                );
                
                $stmt->execute([
                    ':number' => $data['number'],
                    ':date' => $data['date'],
                    ':time' => $data['time'] ?? date('H:i:s')
                ]);
                
                // Clear related caches
                $cache->delete('3d:today');
                $cache->delete('3d:latest');
                $cache->delete("3d:date:{$data['date']}");
                
                sendResponse(['updated' => true]);
                break;
                
            default:
                sendError('Invalid endpoint', 404);
        }
    }
    
    // Invalid endpoint
    else {
        sendError('Invalid endpoint', 404);
    }
    
} catch (Exception $e) {
    error_log("API Error: " . $e->getMessage());
    sendError('Internal server error', 500);
}

// If no valid endpoint is found
sendError('Invalid endpoint', 404);