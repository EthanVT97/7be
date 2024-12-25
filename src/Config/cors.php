<?php
// Allowed origins
$allowedOrigins = [
    'https://twod3d-lottery.onrender.com',
    'http://localhost:3000',
    'http://localhost:8080'
];

// Get the origin header
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Check if the origin is allowed
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
}

// Other CORS headers
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400'); // 24 hours

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}
