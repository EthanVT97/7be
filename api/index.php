<?php
// Handle CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('HTTP/1.1 200 OK');
    exit();
}

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../config.php';

// Get the action from query parameter
$route = $_GET['action'] ?? '';
$subaction = $_GET['subaction'] ?? '';

// Initialize response
$response = ['status' => 'error', 'message' => 'Invalid request'];

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
        DB_USER,
        DB_PASS
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    switch ($route) {
        case 'login':
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $data = json_decode(file_get_contents('php://input'), true);
                $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
                $stmt->execute([$data['username']]);
                $user = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($user && password_verify($data['password'], $user['password'])) {
                    $response = [
                        'status' => 'success',
                        'message' => 'Login successful',
                        'token' => 'dummy_token_' . time(),
                        'user' => [
                            'id' => $user['id'],
                            'username' => $user['username'],
                            'role' => $user['role']
                        ]
                    ];
                } else {
                    $response = [
                        'status' => 'error',
                        'message' => 'Invalid credentials'
                    ];
                }
            }
            break;

        case 'register':
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $data = json_decode(file_get_contents('php://input'), true);
                $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
                
                $stmt = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
                if ($stmt->execute([$data['username'], $data['email'], $hashedPassword])) {
                    $response = [
                        'status' => 'success',
                        'message' => 'Registration successful'
                    ];
                }
            }
            break;

        case 'results':
            if ($subaction === 'live') {
                $stmt = $pdo->query("
                    SELECT * FROM lottery_results 
                    WHERE status = 'active' 
                    ORDER BY draw_time DESC 
                    LIMIT 4
                ");
                $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $response = [
                    'status' => 'success',
                    'data' => $results
                ];
            }
            break;

        case 'pages':
            if ($subaction) {
                $content = [
                    'home' => ['title' => 'Welcome to 2D3D Kobo', 'content' => '<h2>Welcome to 2D3D Kobo</h2><p>Check out our latest lottery results!</p>'],
                    '2d' => ['title' => '2D Lottery', 'content' => '<h2>2D Lottery</h2><p>Place your bets for the next 2D draw.</p>'],
                    '3d' => ['title' => '3D Lottery', 'content' => '<h2>3D Lottery</h2><p>Place your bets for the next 3D draw.</p>'],
                    'thai' => ['title' => 'Thai Lottery', 'content' => '<h2>Thai Lottery</h2><p>Place your bets for the next Thai lottery draw.</p>'],
                    'laos' => ['title' => 'Laos Lottery', 'content' => '<h2>Laos Lottery</h2><p>Place your bets for the next Laos lottery draw.</p>']
                ];
                
                if (isset($content[$subaction])) {
                    $response = [
                        'status' => 'success',
                        'data' => $content[$subaction]
                    ];
                } else {
                    $response = [
                        'status' => 'error',
                        'message' => 'Page not found'
                    ];
                }
            }
            break;
    }
} catch (PDOException $e) {
    $response = [
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ];
}

// Send response
http_response_code(200);
echo json_encode($response);
