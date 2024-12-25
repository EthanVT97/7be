<?php
namespace App\Middleware;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class AuthMiddleware {
    private $key;

    public function __construct() {
        $this->key = getenv('JWT_SECRET');
    }

    public function authenticate() {
        try {
            $headers = getallheaders();
            
            if (!isset($headers['Authorization'])) {
                throw new Exception('No token provided');
            }

            $token = str_replace('Bearer ', '', $headers['Authorization']);
            
            $decoded = JWT::decode($token, new Key($this->key, 'HS256'));
            
            // Check token expiration
            if ($decoded->exp < time()) {
                throw new Exception('Token has expired');
            }

            // Add user info to request
            $_REQUEST['user'] = [
                'id' => $decoded->sub,
                'name' => $decoded->name,
                'role' => $decoded->role
            ];

            return true;

        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode([
                'status' => 'error',
                'message' => 'Unauthorized: ' . $e->getMessage()
            ]);
            exit;
        }
    }

    public function hasRole($requiredRole) {
        return $_REQUEST['user']['role'] === $requiredRole;
    }
} 