<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set error handler
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    error_log("Error ($errno): $errstr in $errfile on line $errline");
});

// Set exception handler
set_exception_handler(function($e) {
    error_log("Uncaught Exception: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Internal server error',
        'debug' => $e->getMessage()
    ]);
});

$uri = parse_url($_SERVER['REQUEST_URI'])['path'];
error_log("Incoming request: " . $_SERVER['REQUEST_METHOD'] . " " . $uri);

// Handle API requests
if (strpos($uri, '/api') === 0) {
    // Handle OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        http_response_code(200);
        exit;
    }
    
    try {
        // Remove /api/index.php from the path if it exists
        $_SERVER['REQUEST_URI'] = preg_replace('/\/api\/index\.php/', '/api', $_SERVER['REQUEST_URI']);
        
        // Set API_REQUEST flag
        define('API_REQUEST', true);
        
        // Health check endpoint - no auth required
        if ($_SERVER['REQUEST_URI'] === '/api/health') {
            require_once __DIR__ . '/api/health.php';
            exit;
        }
        
        // Include the API handler
        require __DIR__ . '/api/index.php';
    } catch (Exception $e) {
        error_log("API Error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'API error',
            'debug' => $e->getMessage()
        ]);
    }
    exit;
}

// Serve static files from public directory
$file = __DIR__ . '/public' . $uri;

if (is_file($file)) {
    // Determine content type
    $ext = pathinfo($file, PATHINFO_EXTENSION);
    $content_types = [
        'html' => 'text/html',
        'css' => 'text/css',
        'js' => 'application/javascript',
        'json' => 'application/json',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif' => 'image/gif'
    ];
    
    if (isset($content_types[$ext])) {
        header('Content-Type: ' . $content_types[$ext]);
    }
    
    readfile($file);
    exit;
}

// Default to index.html
$indexFile = __DIR__ . '/public/index.html';
if (!is_file($indexFile)) {
    error_log("Error: index.html not found at " . $indexFile);
    http_response_code(404);
    echo "Error: index.html not found";
    exit;
}

readfile($indexFile);
