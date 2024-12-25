<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');

$health = [
    'status' => 'healthy',
    'timestamp' => time()
];

http_response_code(200);
echo json_encode($health);
exit;
