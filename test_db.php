<?php
require_once __DIR__ . '/includes/config.php';

try {
    // Test basic query
    $stmt = $conn->query('SELECT version()');
    $version = $stmt->fetchColumn();
    
    // Return success response
    echo json_encode([
        'status' => 'success',
        'message' => 'Successfully connected to PostgreSQL database',
        'data' => [
            'database_version' => $version,
            'host' => DB_HOST,
            'database' => DB_NAME,
            'user' => DB_USER
        ]
    ], JSON_PRETTY_PRINT);

} catch (Exception $e) {
    // Return error response
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection test failed',
        'error' => $e->getMessage()
    ], JSON_PRETTY_PRINT);
} 