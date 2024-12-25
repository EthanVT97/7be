<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../../../includes/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    $data = json_decode(file_get_contents('php://input'), true);

    if (
        !isset($data['username']) || !isset($data['email']) ||
        !isset($data['phone']) || !isset($data['password'])
    ) {
        throw new Exception('အချက်အလက်များ မပြည့်စုံပါ။');
    }

    $auth = new Auth($conn);
    $result = $auth->register(
        $data['username'],
        $data['email'],
        $data['phone'],
        $data['password']
    );

    echo json_encode($result);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
