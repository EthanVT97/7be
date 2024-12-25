<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');

echo json_encode([
    'status' => 'healthy',
    'timestamp' => time(),
    'environment' => 'production'
]);
