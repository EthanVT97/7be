<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');

try {
    $health = [
        'status' => 'healthy',
        'timestamp' => time(),
        'service' => '2d3d-lottery-myn',
        'region' => 'us-west',
        'version' => '1.0.0'
    ];

    http_response_code(200);
    echo json_encode($health);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Health check failed',
        'timestamp' => time()
    ]);
}
exit;
