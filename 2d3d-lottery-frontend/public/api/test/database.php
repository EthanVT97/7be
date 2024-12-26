<?php
require_once __DIR__ . '/../../../vendor/autoload.php';

header('Content-Type: application/json');

try {
    $host = getenv('DB_HOST');
    $dbname = getenv('DB_NAME');
    $user = getenv('DB_USER');
    $pass = getenv('DB_PASS');
    $port = getenv('DB_PORT') ?: '5432';

    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname;sslmode=require";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_TIMEOUT => 5,
        PDO::ATTR_PERSISTENT => true
    ];

    $pdo = new PDO($dsn, $user, $pass, $options);
    $stmt = $pdo->query('SELECT version()');
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Database connection successful',
        'version' => $stmt->fetchColumn(),
        'config' => [
            'host' => $host,
            'database' => $dbname,
            'port' => $port,
            'ssl_mode' => 'require'
        ]
    ]);
    exit(0);
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed',
        'error' => $e->getMessage(),
        'config' => [
            'host' => $host,
            'database' => $dbname,
            'port' => $port,
            'ssl_mode' => 'require'
        ]
    ]);
    exit(1);
} 