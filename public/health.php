<?php
require_once __DIR__ . '/../vendor/autoload.php';

header('Content-Type: application/json');

$health = [
    'status' => 'healthy',
    'timestamp' => date('Y-m-d H:i:s'),
    'checks' => [
        'database' => [
            'status' => 'unknown',
            'error' => null
        ],
        'redis' => [
            'status' => 'unknown',
            'error' => null
        ]
    ]
];

try {
    // Test PostgreSQL
    $dsn = sprintf('pgsql:host=%s;dbname=%s;port=%s', 
        getenv('POSTGRES_HOST'), 
        getenv('POSTGRES_DB'),
        getenv('POSTGRES_PORT') ?? '5432'
    );
    
    $pdo = new PDO($dsn, 
        getenv('POSTGRES_USER'), 
        getenv('POSTGRES_PASSWORD'),
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    
    $stmt = $pdo->query('SELECT version()');
    $version = $stmt->fetch(PDO::FETCH_COLUMN);
    $health['checks']['database'] = [
        'status' => 'connected',
        'version' => $version
    ];

    // Test Redis if available
    if (class_exists('Predis\Client')) {
        $redis = new Predis\Client(getenv('REDIS_URL'));
        $redis->ping();
        $health['checks']['redis'] = [
            'status' => 'connected'
        ];
    }

} catch (PDOException $e) {
    $health['status'] = 'unhealthy';
    $health['checks']['database'] = [
        'status' => 'error',
        'error' => $e->getMessage()
    ];
    http_response_code(503);
} catch (Exception $e) {
    $health['status'] = 'unhealthy';
    $health['checks']['redis'] = [
        'status' => 'error',
        'error' => $e->getMessage()
    ];
    http_response_code(503);
}

echo json_encode($health, JSON_PRETTY_PRINT);
