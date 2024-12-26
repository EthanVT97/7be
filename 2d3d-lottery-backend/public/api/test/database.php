<?php
require_once __DIR__ . '/../../../../vendor/autoload.php';

header('Content-Type: application/json');

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

    echo json_encode([
        'status' => 'success',
        'message' => 'Database connection successful'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed',
        'error' => $e->getMessage()
    ]);
} 