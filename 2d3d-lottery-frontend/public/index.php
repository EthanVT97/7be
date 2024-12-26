<?php
require_once __DIR__ . '/../vendor/autoload.php';

// Handle favicon and static files
if (preg_match('/\.(ico|css|js|gif|jpg|png|svg|woff|woff2|ttf|eot)$/', $_SERVER['REQUEST_URI'])) {
    $file = __DIR__ . $_SERVER['REQUEST_URI'];
    if (file_exists($file)) {
        $ext = pathinfo($file, PATHINFO_EXTENSION);
        $mime_types = [
            'ico' => 'image/x-icon',
            'css' => 'text/css',
            'js' => 'application/javascript',
            'gif' => 'image/gif',
            'jpg' => 'image/jpeg',
            'png' => 'image/png',
            'svg' => 'image/svg+xml',
            'woff' => 'application/font-woff',
            'woff2' => 'application/font-woff2',
            'ttf' => 'application/font-ttf',
            'eot' => 'application/vnd.ms-fontobject'
        ];
        
        if (isset($mime_types[$ext])) {
            header('Content-Type: ' . $mime_types[$ext]);
            header('Cache-Control: public, max-age=31536000');
            readfile($file);
            exit;
        }
    }
    // If file not found, continue to normal processing
}

// Security headers
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');
header('Content-Security-Policy: default-src \'self\'');
header('Referrer-Policy: strict-origin-when-cross-origin');

// Define allowed origins
$allowedOrigins = [
    'https://twod3d.onrender.com',
    'https://twod3d-lottery-api-q68w.onrender.com',
    'chrome-extension://majdfhpaihoncoakbjgbdhglocklcgno'
];

// Get the current origin
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Set CORS headers
if (in_array($origin, $allowedOrigins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    header('Access-Control-Allow-Origin: https://twod3d.onrender.com');
}
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization, Accept, Origin, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
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
        'website' => 'https://twod3d.onrender.com',
        'support' => 'support@twod3d.onrender.com'
    ],
    'links' => [
        'frontend' => 'https://twod3d.onrender.com',
        'health_check' => 'https://twod3d-lottery-api-q68w.onrender.com/health',
        'status' => 'https://twod3d-lottery-api-q68w.onrender.com/api/status'
    ]
];

http_response_code(200);
echo json_encode($response, JSON_PRETTY_PRINT);
