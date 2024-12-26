<?php
session_start();

// Define routes
$routes = [
    '' => 'home',
    'login' => 'auth/login',
    'register' => 'auth/register',
    'dashboard' => 'dashboard/index',
    'admin/users' => 'admin/users',
    'admin/transactions' => 'admin/transactions',
    'admin/settings' => 'admin/settings'
];

// Get the current path
$path = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');

// Handle static files
if (preg_match('/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/', $_SERVER['REQUEST_URI'])) {
    $file = __DIR__ . '/' . $path;
    if (file_exists($file)) {
        $ext = pathinfo($file, PATHINFO_EXTENSION);
        $mime_types = [
            'css' => 'text/css',
            'js' => 'application/javascript',
            'png' => 'image/png',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'gif' => 'image/gif',
            'ico' => 'image/x-icon',
            'svg' => 'image/svg+xml',
            'woff' => 'application/font-woff',
            'woff2' => 'application/font-woff2',
            'ttf' => 'application/font-ttf',
            'eot' => 'application/vnd.ms-fontobject'
        ];
        if (isset($mime_types[$ext])) {
            header('Content-Type: ' . $mime_types[$ext]);
        }
        readfile($file);
        exit;
    }
}

// Check if route exists
$view = isset($routes[$path]) ? $routes[$path] : '404';

// Include header
require_once __DIR__ . '/views/includes/header.php';

// Include the view
require_once __DIR__ . '/views/' . $view . '.php';

// Include footer
require_once __DIR__ . '/views/includes/footer.php'; 