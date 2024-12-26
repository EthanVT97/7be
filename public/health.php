<?php

header('Content-Type: application/json');

$health = [
    'healthy' => true,
    'timestamp' => time(),
    'checks' => [
        'database' => [
            'success' => false,
            'message' => 'Not checked'
        ]
    ]
];

try {
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
    
    $health['checks']['database'] = [
        'success' => true,
        'message' => 'Connected successfully'
    ];
} catch (PDOException $e) {
    $health['checks']['database'] = [
        'success' => false,
        'message' => 'Connection failed: ' . $e->getMessage()
    ];
    $health['healthy'] = false;
    http_response_code(503);
}

echo json_encode($health, JSON_PRETTY_PRINT);
