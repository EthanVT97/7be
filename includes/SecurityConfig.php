<?php

class SecurityConfig {
    private static $allowedIPs = [
        '44.226.145.213',
        '54.187.200.255',
        '34.213.214.55',
        '35.164.95.156',
        '44.230.95.183',
        '44.229.200.200'
    ];

    public static function isIPAllowed($ip) {
        return in_array($ip, self::$allowedIPs);
    }

    public static function validateRequest() {
        $clientIP = $_SERVER['REMOTE_ADDR'];
        if (!self::isIPAllowed($clientIP)) {
            http_response_code(403);
            die(json_encode([
                'status' => 'error',
                'message' => 'Access denied'
            ]));
        }
    }

    public static function getClientIP() {
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            return $_SERVER['HTTP_X_FORWARDED_FOR'];
        }
        return $_SERVER['REMOTE_ADDR'];
    }

    public static function validateOrigin() {
        $allowedOrigins = [
            'https://2d3d-lottery.onrender.com',
            'http://localhost:3000',
            'http://localhost:80'
        ];

        $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
        
        if (!in_array($origin, $allowedOrigins)) {
            http_response_code(403);
            die(json_encode([
                'status' => 'error',
                'message' => 'Invalid origin'
            ]));
        }

        header("Access-Control-Allow-Origin: $origin");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');
    }

    public static function validateMethod($allowedMethods = ['GET', 'POST']) {
        if (!in_array($_SERVER['REQUEST_METHOD'], $allowedMethods)) {
            http_response_code(405);
            die(json_encode([
                'status' => 'error',
                'message' => 'Method not allowed'
            ]));
        }
    }

    public static function rateLimit($requestsPerMinute = 60) {
        $clientIP = self::getClientIP();
        $cacheKey = "rate_limit:$clientIP";
        
        // Initialize rate limiting
        if (!isset($_SESSION[$cacheKey])) {
            $_SESSION[$cacheKey] = [
                'requests' => 0,
                'timestamp' => time()
            ];
        }

        $rateLimit = &$_SESSION[$cacheKey];
        
        // Reset counter if minute has passed
        if (time() - $rateLimit['timestamp'] >= 60) {
            $rateLimit = [
                'requests' => 0,
                'timestamp' => time()
            ];
        }

        // Increment request counter
        $rateLimit['requests']++;

        // Check if limit exceeded
        if ($rateLimit['requests'] > $requestsPerMinute) {
            http_response_code(429);
            die(json_encode([
                'status' => 'error',
                'message' => 'Rate limit exceeded'
            ]));
        }
    }
}
