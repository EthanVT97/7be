<?php
// JWT Configuration
if (file_exists(__DIR__ . '/../.env')) {
    $envFile = parse_ini_file(__DIR__ . '/../.env');
    $jwt_secret = $envFile['JWT_SECRET'] ?? null;
} else {
    $jwt_secret = getenv('JWT_SECRET');
}

define('JWT_SECRET', $jwt_secret ?? 'JJn/ivZloFUBSzqMtDnq/x36mb9556g+eEA0udz5EdY=');
define('JWT_ALGORITHM', 'HS256');
define('JWT_EXPIRY', 3600); // 1 hour in seconds 