<?php
require_once __DIR__ . '/../vendor/autoload.php';

use App\Database\Connection;

header('Content-Type: application/json');

try {
    // Check if required environment variables are set
    $requiredEnvVars = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASS'];
    $missingEnvVars = [];
    foreach ($requiredEnvVars as $var) {
        if (!getenv($var)) {
            $missingEnvVars[] = $var;
        }
    }

    if (!empty($missingEnvVars)) {
        throw new Exception('Missing required environment variables: ' . implode(', ', $missingEnvVars));
    }

    // Test database connection
    $dbStatus = Connection::test();
    if (!$dbStatus) {
        throw new Exception('Database connection test failed');
    }

    // Return success response
    http_response_code(200);
    echo json_encode([
        'status' => 'healthy',
        'timestamp' => date('Y-m-d H:i:s'),
        'checks' => [
            'database' => 'connected',
            'environment' => 'configured'
        ]
    ]);

} catch (Exception $e) {
    // Log the error
    error_log('Health check failed: ' . $e->getMessage());
    
    // Return error response
    http_response_code(503);
    echo json_encode([
        'status' => 'unhealthy',
        'timestamp' => date('Y-m-d H:i:s'),
        'error' => $e->getMessage()
    ]);
} 