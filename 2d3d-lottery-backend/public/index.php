<?php
<<<<<<< HEAD
session_start();

// Define routes
$routes = [
    '' => 'home',
    'login' => 'auth/login',
    'register' => 'auth/register',
    'dashboard' => 'dashboard/index',
    'admin/users' => 'admin/users',
    'admin/transactions' => 'admin/transactions',
    'admin/settings' => 'admin/settings'
];

// Get the current path
$path = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');

// Handle static files
if (preg_match('/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/', $_SERVER['REQUEST_URI'])) {
    $file = __DIR__ . '/' . $path;
    if (file_exists($file)) {
        $ext = pathinfo($file, PATHINFO_EXTENSION);
        $mime_types = [
            'css' => 'text/css',
            'js' => 'application/javascript',
            'png' => 'image/png',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'gif' => 'image/gif',
            'ico' => 'image/x-icon',
            'svg' => 'image/svg+xml',
            'woff' => 'application/font-woff',
            'woff2' => 'application/font-woff2',
            'ttf' => 'application/font-ttf',
            'eot' => 'application/vnd.ms-fontobject'
        ];
        if (isset($mime_types[$ext])) {
            header('Content-Type: ' . $mime_types[$ext]);
        }
        readfile($file);
        exit;
    }
}

// Check if route exists
$view = isset($routes[$path]) ? $routes[$path] : '404';

// Include header
require_once __DIR__ . '/views/includes/header.php';

// Include the view
require_once __DIR__ . '/views/' . $view . '.php';

// Include footer
require_once __DIR__ . '/views/includes/footer.php'; 
=======
require_once __DIR__ . '/../vendor/autoload.php';

// Security headers
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');
header('Content-Security-Policy: default-src \'self\'');
header('Referrer-Policy: strict-origin-when-cross-origin');

// Define allowed origins
$allowedOrigins = [
    'https://2d3d-lottery.onrender.com',
    'https://twod3d-lottery.onrender.com',
    'chrome-extension://majdfhpaihoncoakbjgbdhglocklcgno', // Allow your Chrome extension
    'null',  // Allow requests from local files
    '*'      // Allow all origins temporarily for testing
];

// Get the current origin
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';

// Set CORS headers
header('Access-Control-Allow-Origin: *'); // Allow all origins temporarily for testing
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, Accept, Origin, X-Requested-With');
header('Access-Control-Max-Age: 86400'); // 24 hours
header('Vary: Origin'); // Ensure proper caching with CORS

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// Log request details for debugging
error_log(sprintf(
    "[API Request] Method: %s, Origin: %s, User-Agent: %s",
    $_SERVER['REQUEST_METHOD'],
    $origin,
    $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown'
));

$response = [
    'name' => '2D3D Lottery API',
    'version' => '1.0.0',
    'status' => 'running',
    'environment' => getenv('APP_ENV') ?: 'production',
    'endpoints' => [
        'health' => '/health',
        'status' => '/api/status',
        'documentation' => '/docs'
    ],
    'timestamp' => date('Y-m-d H:i:s'),
    'contact' => [
        'website' => 'https://2d3d-lottery.onrender.com',
        'support' => 'support@2d3d-lottery.onrender.com'
    ],
    'links' => [
        'frontend' => 'https://2d3d-lottery.onrender.com',
        'health_check' => 'https://twod3d-lottery-api-q68w.onrender.com/health',
        'status' => 'https://twod3d-lottery-api-q68w.onrender.com/api/status'
    ]
];

http_response_code(200);
echo json_encode($response, JSON_PRETTY_PRINT); 
>>>>>>> aa145722f6a011a22d3e9f2b280787ab3c45a8fc
