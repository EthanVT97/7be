<?php
namespace App\Middleware;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class AuthMiddleware {
    private $excludedPaths = [
        '/api/auth/login',
        '/api/auth/register'
    ];

    public function handle($request, $next) {
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        // Skip authentication for excluded paths
        if (in_array($path, $this->excludedPaths)) {
            return $next($request);
        }

        $token = $this->getBearerToken();

        if (!$token) {
            http_response_code(401);
            echo json_encode(['error' => 'No token provided']);
            exit();
        }

        try {
            $decoded = JWT::decode($token, new Key($_ENV['JWT_SECRET'], 'HS256'));
            $request['user'] = $decoded;
            return $next($request);
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid token']);
            exit();
        }
    }

    private function getBearerToken() {
        $headers = getallheaders();
        if (!isset($headers['Authorization'])) {
            return null;
        }

        if (preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
            return $matches[1];
        }

        return null;
    }
} 