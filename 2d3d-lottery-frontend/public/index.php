<?php
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// Serve static files directly
if (file_exists(__DIR__ . $uri) && is_file(__DIR__ . $uri)) {
    $ext = pathinfo($uri, PATHINFO_EXTENSION);
    $mime_types = [
        'js' => 'application/javascript',
        'css' => 'text/css',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif' => 'image/gif',
        'svg' => 'image/svg+xml',
        'woff' => 'application/font-woff',
        'woff2' => 'application/font-woff2',
        'ttf' => 'application/font-ttf',
        'eot' => 'application/vnd.ms-fontobject'
    ];
    
    if (isset($mime_types[$ext])) {
        header('Content-Type: ' . $mime_types[$ext]);
    }
    readfile(__DIR__ . $uri);
    exit;
}

// For all other requests, serve index.html
readfile(__DIR__ . '/index.html'); 