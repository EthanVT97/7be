<?php
header('Content-Type: application/json');

$health = [
    'status' => 'healthy',
    'timestamp' => time(),
    'services' => [
        'api' => 'up',
        'database' => checkDatabase()
    ]
];

echo json_encode($health);

function checkDatabase() {
    try {
        require_once __DIR__ . '/../includes/db.php';
        $db->query('SELECT 1');
        return 'up';
    } catch (Exception $e) {
        return 'down';
    }
}
