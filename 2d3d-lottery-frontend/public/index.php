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
}

// Handle API endpoints
if (preg_match('/^\/api\//', $_SERVER['REQUEST_URI']) || $_SERVER['REQUEST_URI'] === '/health') {
    header('Content-Type: application/json; charset=utf-8');
    
    // Security headers for API
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: SAMEORIGIN');
    header('X-XSS-Protection: 1; mode=block');
    header('Content-Security-Policy: default-src \'self\'');
    header('Referrer-Policy: strict-origin-when-cross-origin');

    // Define allowed origins
    $allowedOrigins = [
        'https://twod3d.onrender.com',
        'http://twod3d.onrender.com',
        'https://twod3d-lottery-api-q68w.onrender.com',
        'http://twod3d-lottery-api-q68w.onrender.com',
        'http://localhost:3000',
        'http://localhost:8080',
        'chrome-extension://majdfhpaihoncoakbjgbdhglocklcgno'
    ];

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';

    // Set CORS headers
    if (in_array($origin, $allowedOrigins)) {
        header('Access-Control-Allow-Origin: ' . $origin);
    } else {
        header('Access-Control-Allow-Origin: *');
    }
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, Accept, Origin, X-Requested-With, X-CSRF-Token');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
    header('Vary: Origin, Access-Control-Request-Method, Access-Control-Request-Headers');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit();
    }

    // Forward API requests to backend
    if (preg_match('/^\/api\/results\/latest/', $_SERVER['REQUEST_URI'])) {
        $apiUrl = 'https://twod3d-lottery-api-q68w.onrender.com/api/results/latest';
        
        // Set timeout options
        $ctx = stream_context_create([
            'http' => [
                'timeout' => 5,
                'header' => [
                    'Accept: application/json',
                    'Content-Type: application/json',
                    'User-Agent: 2D3D-Lottery-Frontend/1.0'
                ]
            ],
            'ssl' => [
                'verify_peer' => true,
                'verify_peer_name' => true
            ]
        ]);

        try {
            // First check if backend is healthy
            $healthCheck = @file_get_contents('https://twod3d-lottery-api-q68w.onrender.com/health', false, $ctx);
            if ($healthCheck === false) {
                throw new Exception('Backend health check failed');
            }

            $response = @file_get_contents($apiUrl, false, $ctx);
            
            if ($response === false) {
                // Handle backend server error
                http_response_code(503);
                echo json_encode([
                    'success' => false,
                    'error' => 'Backend server is not responding',
                    'message' => 'Please try again later',
                    'status' => [
                        'api_url' => $apiUrl,
                        'health_check' => false,
                        'timestamp' => date('Y-m-d H:i:s'),
                        'error_info' => error_get_last()
                    ]
                ]);
                exit();
            }

            // Forward the response
            echo $response;
            exit();
        } catch (Exception $e) {
            // Handle any other errors
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Internal server error',
                'message' => 'An unexpected error occurred',
                'details' => [
                    'error_message' => $e->getMessage(),
                    'timestamp' => date('Y-m-d H:i:s'),
                    'api_status' => [
                        'url' => $apiUrl,
                        'health_check' => false
                    ]
                ]
            ]);
            exit();
        }
    }

    // Health check endpoint
    if ($_SERVER['REQUEST_URI'] === '/health') {
        $backendHealth = false;
        $backendStatus = 'unknown';
        
        try {
            $ctx = stream_context_create([
                'http' => ['timeout' => 3],
                'ssl' => [
                    'verify_peer' => true,
                    'verify_peer_name' => true
                ]
            ]);
            
            $healthCheck = @file_get_contents('https://twod3d-lottery-api-q68w.onrender.com/health', false, $ctx);
            if ($healthCheck !== false) {
                $backendHealth = true;
                $backendStatus = 'healthy';
            }
        } catch (Exception $e) {
            $backendStatus = 'unhealthy';
        }

        $response = [
            'status' => 'ok',
            'timestamp' => date('Y-m-d H:i:s'),
            'environment' => getenv('APP_ENV') ?: 'production',
            'backend' => [
                'url' => 'https://twod3d-lottery-api-q68w.onrender.com',
                'health' => $backendHealth,
                'status' => $backendStatus,
                'last_check' => date('Y-m-d H:i:s')
            ],
            'frontend' => [
                'url' => 'https://twod3d.onrender.com',
                'status' => 'running'
            ]
        ];

        echo json_encode($response, JSON_PRETTY_PRINT);
        exit();
    }

    // Default API response
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

    echo json_encode($response, JSON_PRETTY_PRINT);
    exit();
}

// Set security headers for frontend
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Content-Security-Policy: default-src \'self\' \'unsafe-inline\' \'unsafe-eval\' https:; img-src \'self\' data: https:; style-src \'self\' \'unsafe-inline\' https:; font-src \'self\' data: https:; connect-src \'self\' https://twod3d-lottery-api-q68w.onrender.com https://twod3d.onrender.com;');

// Get the current path
$path = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');

// Define routes
$routes = [
    '' => 'home',
    'login' => 'auth/login',
    'register' => 'auth/register',
    'dashboard' => 'dashboard/index',
    'play' => 'game/play',
    'results' => 'game/results',
    'profile' => 'user/profile',
    'transactions' => 'user/transactions'
];

// Check if route exists
$view = isset($routes[$path]) ? $routes[$path] : '404';

// Set content type for HTML
header('Content-Type: text/html; charset=utf-8');

// Include the view
if (file_exists(__DIR__ . '/views/' . $view . '.php')) {
    require_once __DIR__ . '/views/includes/header.php';
    require_once __DIR__ . '/views/' . $view . '.php';
    require_once __DIR__ . '/views/includes/footer.php';
} else {
    // Fallback to index.html for client-side routing
    readfile(__DIR__ . '/index.html');
}
