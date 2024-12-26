<?php
require_once __DIR__ . '/../../../vendor/autoload.php';

use App\Auth\AuthController;
use App\Database\Connection;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://twod3d-lottery.onrender.com');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $data = json_decode(file_get_contents('php://input'), true);
    error_log("Raw request data: " . print_r($data, true));

    if (
        !isset($data['username']) || !isset($data['email']) ||
        !isset($data['phone']) || !isset($data['password'])
    ) {
        throw new Exception('အချက်အလက်များ မပြည့်စုံပါ။');
    }

    $auth = new AuthController(Connection::getInstance());
    $result = $auth->register(
        $data['username'],
        $data['email'],
        $data['phone'],
        $data['password']
    );

    if ($result['success']) {
        http_response_code(201);
    } else {
        http_response_code(400);
    }
    echo json_encode($result);
} catch (Exception $e) {
    error_log("Registration error: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
