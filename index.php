<?php
// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Check if user is logged in
$isLoggedIn = isset($_SESSION['user_id']);

// Set content type to JSON for API responses
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get the requested path
$request = $_SERVER['REQUEST_URI'];
$path = parse_url($request, PHP_URL_PATH);

// Remove leading slash and get path segments
$path = ltrim($path, '/');
$segments = explode('/', $path);

// Basic routing
$route = $segments[0] ?? '';

// Initialize response
$response = ['status' => 'error', 'message' => 'Invalid request'];

try {
    require_once 'config.php';
    
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
        DB_USER,
        DB_PASS
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    switch ($route) {
        case '':
        case 'home':
            $response = [
                'status' => 'success',
                'data' => [
                    'title' => 'Welcome to 2D3D Kobo',
                    'isLoggedIn' => $isLoggedIn
                ]
            ];
            break;

        case 'login':
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $data = json_decode(file_get_contents('php://input'), true);
                $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
                $stmt->execute([$data['username']]);
                $user = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($user && password_verify($data['password'], $user['password'])) {
                    $_SESSION['user_id'] = $user['id'];
                    $_SESSION['username'] = $user['username'];
                    
                    $response = [
                        'status' => 'success',
                        'message' => 'Login successful',
                        'user' => [
                            'id' => $user['id'],
                            'username' => $user['username']
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

        case 'logout':
            session_destroy();
            $response = [
                'status' => 'success',
                'message' => 'Logged out successfully'
            ];
            break;

        case 'register':
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $data = json_decode(file_get_contents('php://input'), true);
                
                // Check if username exists
                $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE username = ?");
                $stmt->execute([$data['username']]);
                if ($stmt->fetchColumn() > 0) {
                    $response = [
                        'status' => 'error',
                        'message' => 'Username already exists'
                    ];
                    break;
                }

                // Create new user
                $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
                $stmt = $pdo->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
                
                if ($stmt->execute([$data['username'], $hashedPassword])) {
                    $response = [
                        'status' => 'success',
                        'message' => 'Registration successful'
                    ];
                } else {
                    $response = [
                        'status' => 'error',
                        'message' => 'Registration failed'
                    ];
                }
            }
            break;

        default:
            http_response_code(404);
            $response = [
                'status' => 'error',
                'message' => 'Route not found'
            ];
            break;
    }
} catch (PDOException $e) {
    http_response_code(500);
    $response = [
        'status' => 'error',
        'message' => 'Database error'
    ];
}

// Send JSON response
echo json_encode($response);
