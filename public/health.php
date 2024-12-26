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
    $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', 
        getenv('DB_HOST'), 
        getenv('DB_DATABASE')
    );
    
    $pdo = new PDO($dsn, 
        getenv('DB_USERNAME'), 
        getenv('DB_PASSWORD'),
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
