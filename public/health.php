<?php
require_once __DIR__ . '/../includes/config.php';

header('Content-Type: application/json');

try {
    // Test database connection
    $stmt = $conn->query('SELECT version()');
    $dbVersion = $stmt->fetchColumn();

    // Get connection stats
    $stmt = $conn->query('SELECT count(*) FROM pg_stat_activity');
    $activeConnections = $stmt->fetchColumn();

    echo json_encode([
        'status' => 'healthy',
        'timestamp' => date('Y-m-d H:i:s'),
        'environment' => getenv('APP_ENV') ?: 'production',
        'database' => [
            'status' => 'connected',
            'version' => $dbVersion,
            'active_connections' => (int)$activeConnections,
            'host' => DB_HOST
        ]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'unhealthy',
        'timestamp' => date('Y-m-d H:i:s'),
        'error' => $e->getMessage()
    ]);
}
