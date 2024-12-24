<?php
$uri = parse_url($_SERVER['REQUEST_URI'])['path'];

// Handle API requests
if (strpos($uri, '/api') === 0) {
    require __DIR__ . '/api/index.php';
    exit;
}

// Serve static files from public directory
$file = __DIR__ . '/public' . $uri;

if (is_file($file)) {
    // Determine content type
    $ext = pathinfo($file, PATHINFO_EXTENSION);
    $content_types = [
        'html' => 'text/html',
        'css' => 'text/css',
        'js' => 'application/javascript',
        'json' => 'application/json',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif' => 'image/gif'
    ];
    
    if (isset($content_types[$ext])) {
        header('Content-Type: ' . $content_types[$ext]);
    }
    
    readfile($file);
    exit;
}

// Default to index.html
readfile(__DIR__ . '/public/index.html');
