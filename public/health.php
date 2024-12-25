<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Database\Connection;

header('Content-Type: application/json');

try {
    // Test database connection
    if (!Connection::test()) {
        throw new Exception('Database connection failed');
    }

    // Return success response
    http_response_code(200);
    echo json_encode([
        'status' => 'healthy',
        'timestamp' => date('Y-m-d H:i:s'),
        'checks' => [
            'database' => 'connected'
        ]
    ]);

} catch (Exception $e) {
    // Return error response
    http_response_code(503);
    echo json_encode([
        'status' => 'unhealthy',
        'timestamp' => date('Y-m-d H:i:s'),
        'error' => $e->getMessage()
    ]);
}
