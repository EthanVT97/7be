<?php
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

// Start request timing
$requestStart = microtime(true);

// Enable error reporting for development
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Set headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Cache-Control: no-store, no-cache, must-revalidate');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Response helpers
function sendResponse($data, $status = 'success', $message = '', $code = 200) {
    global $requestStart, $logger;
    
    $response = [
        'status' => $status,
        'message' => $message,
        'data' => $data,
        'timestamp' => date('Y-m-d\TH:i:sP')
    ];
    
    http_response_code($code);
    
    // Log the request
    $duration = (microtime(true) - $requestStart) * 1000;
    $logger->log($_REQUEST, $response, $duration);
    
    echo json_encode($response);
    exit();
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
$basePath = '/2D3DKobo/api';
$path = str_replace($basePath, '', parse_url($requestUri, PHP_URL_PATH));
$pathParts = array_filter(explode('/', $path));
$method = $_SERVER['REQUEST_METHOD'];

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

try {
    $resultsFetcher = new LotteryResultsFetcher($conn);
    
    // Handle 2D endpoints
    if ($pathParts[1] === '2d') {
        $cacheKey = "2d:" . ($pathParts[2] ?? '') . ":" . implode(":", array_slice($pathParts, 3));
        
        switch ($pathParts[2] ?? '') {
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
                if (!isset($pathParts[3])) {
                    sendError('Date parameter is required');
                }
                
                if ($cached = $cache->get($cacheKey)) {
                    sendResponse($cached);
                }
                
                $results = $resultsFetcher->getResultsByDateRange('2D', $pathParts[3], $pathParts[3]);
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
                if ($method !== 'POST') {
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
    else if ($pathParts[1] === '3d') {
        $cacheKey = "3d:" . ($pathParts[2] ?? '') . ":" . implode(":", array_slice($pathParts, 3));
        
        switch ($pathParts[2] ?? '') {
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
                if (!isset($pathParts[3])) {
                    sendError('Date parameter is required');
                }
                
                if ($cached = $cache->get($cacheKey)) {
                    sendResponse($cached);
                }
                
                $results = $resultsFetcher->getResultsByDateRange('3D', $pathParts[3], $pathParts[3]);
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
                if ($method !== 'POST') {
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