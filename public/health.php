<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');

// Basic health check
$health = [
    'status' => 'healthy',
    'timestamp' => time(),
    'service' => '2d3d-lottery-myn',
    'region' => 'us-west',
    'version' => '1.0.0'
];

http_response_code(200);
echo json_encode($health);
exit;
