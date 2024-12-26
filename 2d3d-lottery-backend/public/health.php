<?php
require_once __DIR__ . '/../vendor/autoload.php';

header('Content-Type: application/json');

$health = [
    'status' => 'healthy',
    'timestamp' => date('Y-m-d H:i:s'),
    'checks' => [
        'database' => [
            'status' => 'unknown'
        ],
        'application' => [
            'status' => 'healthy',
            'version' => '1.0.0'
        ]
    ]
];

try {
    // Test PostgreSQL connection
    $dsn = sprintf('pgsql:host=%s;dbname=%s;port=%s', 
        getenv('DB_HOST'), 
        getenv('DB_NAME'),
        getenv('DB_PORT') ?? '5432'
    );
    
    $pdo = new PDO($dsn, 
        getenv('DB_USER'), 
        getenv('DB_PASS'),
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    
    $stmt = $pdo->query('SELECT version()');
    $health['checks']['database'] = [
        'status' => 'connected',
        'version' => $stmt->fetch(PDO::FETCH_COLUMN)
    ];

} catch (Exception $e) {
    $health['status'] = 'unhealthy';
    $health['checks']['database'] = [
        'status' => 'error',
        'error' => $e->getMessage()
    ];
    http_response_code(503);
}

echo json_encode($health, JSON_PRETTY_PRINT); 