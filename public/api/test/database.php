<?php
header('Content-Type: application/json');

use App\Config\Database;

require_once __DIR__ . '/../../../vendor/autoload.php';

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    if ($conn) {
        // Test query
        $stmt = $conn->query("SELECT version()");
        $version = $stmt->fetch(PDO::FETCH_COLUMN);
        
        echo json_encode([
            'status' => true,
            'message' => 'Database connection successful',
            'version' => $version,
            'env' => [
                'host' => getenv('POSTGRES_HOST'),
                'database' => getenv('POSTGRES_DB'),
                'port' => getenv('POSTGRES_PORT')
            ]
        ]);
    } else {
        throw new Exception("Connection failed");
    }
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => false,
        'message' => 'Database connection failed: ' . $e->getMessage()
    ]);
} 