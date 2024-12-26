<?php

header('Content-Type: application/json');

try {
    // Check environment variables
    $requiredEnvVars = ['POSTGRES_HOST', 'POSTGRES_DB', 'POSTGRES_USER', 'POSTGRES_PASSWORD'];
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
    $dsn = sprintf('pgsql:host=%s;dbname=%s;port=%s', 
        getenv('POSTGRES_HOST'), 
        getenv('POSTGRES_DB'),
        getenv('POSTGRES_PORT') ?? '5432'
    );
    
    $pdo = new PDO($dsn, 
        getenv('POSTGRES_USER'), 
        getenv('POSTGRES_PASSWORD'),
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    
    // Test query
    $stmt = $pdo->query('SELECT version()');
    $version = $stmt->fetch(PDO::FETCH_COLUMN);

    echo json_encode([
        'status' => 'healthy',
        'timestamp' => date('Y-m-d H:i:s'),
        'checks' => [
            'database' => [
                'status' => 'connected',
                'version' => $version
            ],
            'environment' => 'configured'
        ]
    ]);

} catch (Exception $e) {
    error_log('Health check failed: ' . $e->getMessage());
    http_response_code(503);
    echo json_encode([
        'status' => 'unhealthy',
        'timestamp' => date('Y-m-d H:i:s'),
        'error' => $e->getMessage()
    ]);
}
