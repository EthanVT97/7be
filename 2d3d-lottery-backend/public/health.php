<?php
require_once __DIR__ . '/../vendor/autoload.php';

// Define constants for service statuses
define('STATUS_HEALTHY', 'healthy');
define('STATUS_CONNECTED', 'connected');
define('STATUS_ERROR', 'error');
define('STATUS_DISABLED', 'disabled');
define('STATUS_CHECKING', 'checking');

// Check Redis extension and class
if (!extension_loaded('redis')) {
    throw new Exception('Redis extension is not loaded');
}

if (!class_exists('Redis')) {
    throw new Exception('Redis class is not available');
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
    'https://2d3d-lottery.onrender.com',
    'https://twod3d-lottery.onrender.com',
    'https://twod3d-lottery-api-q68w.onrender.com'
];

// Get the current origin
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Set CORS headers based on origin
if (in_array($origin, $allowedOrigins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    header('Access-Control-Allow-Origin: ' . $allowedOrigins[0]);
}
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 86400');
header('Vary: Origin');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

$startTime = microtime(true);
$requestId = uniqid('health_', true);

$health = [
    'status' => STATUS_HEALTHY,
    'timestamp' => date('Y-m-d H:i:s'),
    'request_id' => $requestId,
    'environment' => getenv('APP_ENV'),
    'checks' => [
        'database' => [
            'status' => STATUS_CHECKING,
            'config' => [
                'host' => getenv('DB_HOST'),
                'port' => getenv('DB_PORT') ?? '5432',
                'ssl_mode' => getenv('DB_SSL_MODE') ?? 'require'
            ]
        ],
        'redis' => [
            'status' => STATUS_CHECKING,
            'config' => [
                'url' => preg_replace('/:[^:]*@/', ':***@', getenv('REDIS_URL') ?? ''),
            ]
        ],
        'security' => [
            'status' => STATUS_CHECKING,
            'client_ip' => $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'],
            'origin' => $origin,
            'render_ip' => false,
            'allowed_origins' => $allowedOrigins,
            'origin_valid' => true
        ],
        'application' => [
            'status' => STATUS_HEALTHY,
            'version' => '1.0.0',
            'memory' => [
                'used' => memory_get_usage(true),
                'peak' => memory_get_peak_usage(true)
            ],
            'uptime' => time() - $_SERVER['REQUEST_TIME'],
            'error_log' => error_get_last()
        ]
    ]
];

// Enhanced error logging function
function logHealthError($type, $message, $context = []) {
    $logData = [
        'timestamp' => date('Y-m-d H:i:s'),
        'type' => $type,
        'message' => $message,
        'context' => $context,
        'request_id' => $GLOBALS['requestId'] ?? uniqid(),
        'client_ip' => $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'],
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown'
    ];
    
    error_log(json_encode($logData));
}

try {
    $dsn = sprintf(
        'pgsql:host=%s;port=%s;dbname=%s;sslmode=require', 
        getenv('DB_HOST'), 
        getenv('DB_PORT') ?? '5432',
        getenv('DB_NAME')
    );
    
    $startConnect = microtime(true);
    $pdo = new PDO($dsn, 
        getenv('DB_USER'), 
        getenv('DB_PASS'),
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_TIMEOUT => 5,
            PDO::ATTR_PERSISTENT => true
        ]
    );
    
    $stmt = $pdo->query('SELECT version()');
    $version = $stmt->fetch(PDO::FETCH_COLUMN);
    
    $stmt = $pdo->query('SELECT count(*) FROM pg_stat_activity');
    $connections = $stmt->fetch(PDO::FETCH_COLUMN);
    
    $connectionTime = (microtime(true) - $startConnect) * 1000;
    
    $health['checks']['database'] = [
        'status' => STATUS_CONNECTED,
        'version' => $version,
        'latency' => round($connectionTime, 2) . 'ms',
        'active_connections' => (int)$connections,
        'config' => $health['checks']['database']['config']
    ];

    // Redis check
    if (getenv('REDIS_URL')) {
        $startRedis = microtime(true);
        $redisUrl = parse_url(getenv('REDIS_URL'));
        
        if ($redisUrl !== false) {
            try {
                $redis = new Redis();
                $connected = @$redis->connect(
                    $redisUrl['host'] ?? 'localhost',
                    $redisUrl['port'] ?? 6379,
                    5.0 // timeout
                );
                
                if (!$connected) {
                    throw new Exception('Failed to connect to Redis');
                }
                
                if (isset($redisUrl['pass'])) {
                    $authResult = @$redis->auth($redisUrl['pass']);
                    if (!$authResult) {
                        throw new Exception('Redis authentication failed');
                    }
                }
                
                // Test Redis connection with basic operations
                $pingResult = @$redis->ping();
                if ($pingResult !== '+PONG' && $pingResult !== true) {
                    throw new Exception('Redis ping test failed');
                }
                
                // Test Redis read/write
                $setResult = @$redis->setex('health_check', 60, 'ok');
                if (!$setResult) {
                    throw new Exception('Redis write test failed');
                }
                
                $testValue = @$redis->get('health_check');
                if ($testValue !== 'ok') {
                    throw new Exception('Redis read test failed');
                }
                
                // Get Redis info
                $redisInfo = @$redis->info();
                if (!is_array($redisInfo)) {
                    throw new Exception('Failed to get Redis info');
                }
                
                $redisLatency = (microtime(true) - $startRedis) * 1000;
                
                $health['checks']['redis'] = [
                    'status' => STATUS_CONNECTED,
                    'version' => $redisInfo['redis_version'] ?? 'unknown',
                    'latency' => round($redisLatency, 2) . 'ms',
                    'memory_used' => $redisInfo['used_memory_human'] ?? 'unknown',
                    'connected_clients' => $redisInfo['connected_clients'] ?? 0,
                    'config' => $health['checks']['redis']['config']
                ];
            } catch (Exception $e) {
                logHealthError('redis_error', $e->getMessage(), [
                    'redis_url' => $redisUrl['host'] ?? 'unknown'
                ]);
                throw $e;
            } finally {
                if (isset($redis)) {
                    try {
                        @$redis->close();
                    } catch (Exception $e) {
                        // Ignore close errors
                    }
                }
            }
        } else {
            throw new Exception('Invalid Redis URL format');
        }
    } else {
        $health['checks']['redis']['status'] = STATUS_DISABLED;
    }

    // Security check with enhanced logging
    $clientIP = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'];
    $isValidOrigin = empty($origin) || in_array($origin, $allowedOrigins);
    
    if (!$isValidOrigin) {
        logHealthError('security_warning', 'Invalid origin detected', [
            'origin' => $origin,
            'client_ip' => $clientIP
        ]);
    }
    
    $health['checks']['security'] = [
        'status' => $isValidOrigin ? STATUS_HEALTHY : 'warning',
        'client_ip' => $clientIP,
        'origin' => $origin,
        'render_ip' => false,
        'allowed_origins' => $allowedOrigins,
        'origin_valid' => $isValidOrigin
    ];

    // Set overall status based on all checks
    $allHealthy = true;
    foreach ($health['checks'] as $checkName => $check) {
        if ($check['status'] !== STATUS_HEALTHY && 
            $check['status'] !== STATUS_CONNECTED && 
            $check['status'] !== STATUS_DISABLED) {
            $allHealthy = false;
            logHealthError('health_check_failed', "Service $checkName is not healthy", [
                'status' => $check['status'],
                'details' => $check
            ]);
            break;
        }
    }
    
    if (!$allHealthy) {
        $health['status'] = 'degraded';
        http_response_code(503);
    }

} catch (Exception $e) {
    logHealthError('critical', $e->getMessage(), [
        'code' => $e->getCode(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'trace' => $e->getTraceAsString()
    ]);
    
    $health['status'] = 'unhealthy';
    
    if (strpos(get_class($e), 'Redis') !== false || strpos($e->getMessage(), 'Redis') !== false) {
        $health['checks']['redis'] = [
            'status' => STATUS_ERROR,
            'error' => 'Redis connection failed: ' . $e->getMessage(),
            'error_code' => $e->getCode(),
            'config' => $health['checks']['redis']['config']
        ];
    } elseif ($e instanceof PDOException) {
        $health['checks']['database'] = [
            'status' => STATUS_ERROR,
            'error' => 'Database connection failed',
            'error_code' => $e->getCode(),
            'config' => $health['checks']['database']['config']
        ];
    }
    
    http_response_code(503);
}

$health['execution_time'] = round((microtime(true) - $startTime) * 1000, 2) . 'ms';

echo json_encode($health, JSON_PRETTY_PRINT); 