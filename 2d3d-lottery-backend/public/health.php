<?php
require_once __DIR__ . '/../vendor/autoload.php';

use App\Database\Connection;

header('Content-Type: application/json');

try {
    $dbStatus = Connection::test();
    
    echo json_encode([
        'status' => 'healthy',
        'timestamp' => date('Y-m-d H:i:s'),
        'database' => $dbStatus ? 'connected' : 'disconnected'
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'unhealthy',
        'error' => $e->getMessage()
    ]);
} 